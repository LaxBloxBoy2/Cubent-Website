import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for LLM_COMPLETION telemetry events
const llmCompletionEventSchema = z.object({
  type: z.literal('LLM_COMPLETION'),
  properties: z.object({
    inputTokens: z.number(),
    outputTokens: z.number(), 
    cacheReadTokens: z.number().optional(),
    cacheWriteTokens: z.number().optional(),
    cost: z.number().optional(),
    // Additional telemetry properties
    modelId: z.string().optional(),
    provider: z.string().optional(),
    sessionId: z.string().optional(),
    timestamp: z.number().optional(),
  })
});

// Schema for other telemetry events (for future extensibility)
const telemetryEventSchema = z.union([
  llmCompletionEventSchema,
  // Add other event types here as needed
  z.object({
    type: z.string(),
    properties: z.record(z.any())
  })
]);

export async function POST(request: NextRequest) {
  try {
    // Check for Bearer token in Authorization header
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        // Check if token is a custom extension token (cubent_ext_) or session ID (sess_)
        if (token.startsWith('cubent_ext_') || token.startsWith('sess_')) {
          console.log('Events endpoint - Detected extension token format, checking PendingLogin table');
          // For extension tokens, check the PendingLogin table (like other working endpoints)
          const pendingLogin = await database.pendingLogin.findFirst({
            where: {
              token,
              expiresAt: { gt: new Date() },
            },
          });

          if (pendingLogin) {
            // Get the database user ID from the Clerk user ID
            const dbUser = await database.user.findUnique({
              where: { clerkId: pendingLogin.userId },
              select: { id: true }
            });

            if (dbUser) {
              userId = dbUser.id;
              console.log('Events endpoint - PendingLogin validation successful:', {
                clerkUserId: pendingLogin.userId,
                dbUserId: userId
              });
            } else {
              console.log('Events endpoint - Database user not found for Clerk ID:', pendingLogin.userId);
            }
          } else {
            console.log('Events endpoint - Extension token not found in PendingLogin table');
          }
        } else {
          console.log('Events endpoint - Attempting Clerk JWT validation');
          // Try to validate as Clerk JWT
          const { clerkClient } = await import('@repo/auth/server');
          const client = await clerkClient();
          const session = await client.sessions.getSession(token);
          userId = session.userId;
          console.log('Events endpoint - Clerk JWT validation successful:', { userId });
        }
      } catch (clerkError) {
        console.log('Events endpoint - Clerk authentication failed, trying API keys:', clerkError);
        console.log('Events endpoint - Token format:', token.substring(0, 20) + '...');

        // Fallback: Try API key authentication
        try {
          const hashedToken = await hashApiKey(token);
          const apiKey = await database.apiKey.findFirst({
            where: {
              keyHash: hashedToken,
              isActive: true,
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
              ]
            },
            include: { user: true }
          });

          if (apiKey) {
            userId = apiKey.userId;

            // Update usage count and last used timestamp
            await database.apiKey.update({
              where: { id: apiKey.id },
              data: {
                lastUsedAt: new Date(),
                usageCount: { increment: 1 }
              }
            });
          } else {
            // Final fallback: legacy system (User.extensionApiKey - plain text)
            const user = await database.user.findFirst({
              where: { extensionApiKey: token }
            });

            if (user) {
              userId = user.id;
            }
          }
        } catch (apiKeyError) {
          console.error('Events endpoint - API key authentication failed:', apiKeyError);
        }
      }
    }

    if (!userId) {
      console.log('Events endpoint - Authentication failed: No valid Clerk JWT or API key found');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session token or API key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedEvent = telemetryEventSchema.parse(body);

    // Handle LLM_COMPLETION events specifically (handle both formats)
    if (validatedEvent.type === 'LLM_COMPLETION' || validatedEvent.type === 'LLM Completion') {
      console.log('Processing LLM_COMPLETION event for userId:', userId);
      const { properties } = validatedEvent;
      const totalTokens = properties.inputTokens + properties.outputTokens;
      console.log('Token calculation:', { inputTokens: properties.inputTokens, outputTokens: properties.outputTokens, totalTokens });
      
      // Calculate cost if not provided (basic estimation)
      let calculatedCost = properties.cost;
      if (!calculatedCost && properties.modelId) {
        // Basic cost calculation - you can enhance this based on your pricing model
        const costPerToken = 0.00001; // $0.00001 per token as default
        calculatedCost = totalTokens * costPerToken;
      }

      // Store in UsageAnalytics for detailed tracking
      console.log('Creating UsageAnalytics record...');
      try {
        await database.usageAnalytics.create({
        data: {
          userId,
          modelId: properties.modelId || 'unknown',
          tokensUsed: totalTokens,
          inputTokens: properties.inputTokens,
          outputTokens: properties.outputTokens,
          cacheReadTokens: properties.cacheReadTokens || 0,
          cacheWriteTokens: properties.cacheWriteTokens || 0,
          cubentUnitsUsed: 0, // LLM completion events don't track Cubent units directly
          requestsMade: 1,
          costAccrued: calculatedCost || 0,
          sessionId: properties.sessionId,
          metadata: {
            provider: properties.provider,
            eventType: 'LLM_COMPLETION',
            timestamp: properties.timestamp || Date.now()
          }
        }
        });
        console.log('UsageAnalytics record created successfully');
      } catch (analyticsError) {
        console.error('Failed to create UsageAnalytics record:', analyticsError);
        throw analyticsError;
      }

      // Update daily UsageMetrics
      console.log('Updating UsageMetrics...');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find existing usage metrics for today
      const existingMetrics = await database.usageMetrics.findFirst({
        where: {
          userId,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Next day
          }
        }
      });

      try {
        if (existingMetrics) {
          console.log('Updating existing UsageMetrics record:', existingMetrics.id);
          // Update existing record
          await database.usageMetrics.update({
            where: { id: existingMetrics.id },
            data: {
              tokensUsed: { increment: totalTokens },
              inputTokens: { increment: properties.inputTokens },
              outputTokens: { increment: properties.outputTokens },
              cacheReadTokens: { increment: properties.cacheReadTokens || 0 },
              cacheWriteTokens: { increment: properties.cacheWriteTokens || 0 },
              requestsMade: { increment: 1 },
              costAccrued: { increment: calculatedCost || 0 }
            }
          });
          console.log('UsageMetrics record updated successfully');
        } else {
          console.log('Creating new UsageMetrics record for date:', today);
          // Create new record
          await database.usageMetrics.create({
            data: {
              userId,
              tokensUsed: totalTokens,
              inputTokens: properties.inputTokens,
              outputTokens: properties.outputTokens,
              cacheReadTokens: properties.cacheReadTokens || 0,
              cacheWriteTokens: properties.cacheWriteTokens || 0,
              requestsMade: 1,
              costAccrued: calculatedCost || 0,
              date: today
            }
          });
          console.log('UsageMetrics record created successfully');
        }
      } catch (metricsError) {
        console.error('Failed to update UsageMetrics:', metricsError);
        throw metricsError;
      }

      return NextResponse.json({
        success: true,
        message: 'LLM completion event tracked successfully',
        data: {
          tokensProcessed: totalTokens,
          inputTokens: properties.inputTokens,
          outputTokens: properties.outputTokens,
          cost: calculatedCost
        }
      });
    }

    // Handle other event types (for future extensibility)
    console.log('Received telemetry event:', validatedEvent.type, validatedEvent.properties);
    
    return NextResponse.json({
      success: true,
      message: 'Telemetry event received',
      eventType: validatedEvent.type
    });

  } catch (error) {
    console.error('Telemetry event processing error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid event data',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Hash API key for secure storage
 */
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
