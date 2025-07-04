import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for telemetry events
const telemetryEventSchema = z.object({
  type: z.string(),
  properties: z.object({
    // Common properties
    appName: z.string().optional(),
    appVersion: z.string().optional(),
    vscodeVersion: z.string().optional(),
    platform: z.string().optional(),
    editorName: z.string().optional(),
    language: z.string().optional(),
    mode: z.string().optional(),
    taskId: z.string().optional(),
    apiProvider: z.string().optional(),
    modelId: z.string().optional(),
    diffStrategy: z.string().optional(),
    isSubtask: z.boolean().optional(),
    
    // LLM Completion specific properties
    inputTokens: z.number().optional(),
    outputTokens: z.number().optional(),
    cacheReadTokens: z.number().optional(),
    cacheWriteTokens: z.number().optional(),
    cost: z.number().optional(),
  }).passthrough(), // Allow additional properties
});

/**
 * Telemetry events endpoint
 * Handles LLM_COMPLETION and other telemetry events from the extension
 */
export async function POST(request: NextRequest) {
  try {
    // Check for Bearer token in Authorization header
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        // Verify the token and get user ID
        const tokenRecord = await database.extensionToken.findUnique({
          where: { token },
          include: { user: true }
        });

        if (tokenRecord && tokenRecord.user) {
          userId = tokenRecord.user.clerkId;
        }
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - valid Bearer token required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const event = telemetryEventSchema.parse(body);

    console.log('Telemetry event received:', {
      userId,
      type: event.type,
      properties: event.properties
    });

    // Find the user in the database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Handle LLM_COMPLETION events specifically
    if (event.type === 'LLM Completion') {
      const {
        inputTokens = 0,
        outputTokens = 0,
        cacheReadTokens = 0,
        cacheWriteTokens = 0,
        cost = 0,
        modelId,
        apiProvider,
        taskId
      } = event.properties;

      const totalTokens = inputTokens + outputTokens + (cacheReadTokens || 0) + (cacheWriteTokens || 0);

      // Create comprehensive usage analytics record
      await database.usageAnalytics.create({
        data: {
          userId: dbUser.id,
          modelId: modelId || 'unknown',
          cubentUnitsUsed: 0, // LLM completion events don't track Cubent units directly
          tokensUsed: totalTokens,
          costAccrued: cost,
          requestsMade: 1,
          metadata: {
            provider: apiProvider || 'unknown',
            timestamp: Date.now(),
            inputTokens,
            outputTokens,
            cacheReadTokens,
            cacheWriteTokens,
            eventType: 'LLM_COMPLETION',
            taskId,
            ...event.properties
          }
        },
      });

      // Update user's total usage counters
      await database.user.update({
        where: { id: dbUser.id },
        data: {
          lastActiveAt: new Date(),
        },
      });

      // Update daily usage metrics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingMetrics = await database.usageMetrics.findFirst({
        where: {
          userId: dbUser.id,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });

      if (existingMetrics) {
        await database.usageMetrics.update({
          where: { id: existingMetrics.id },
          data: {
            tokensUsed: {
              increment: totalTokens
            },
            requestsMade: {
              increment: 1
            }
          },
        });
      } else {
        await database.usageMetrics.create({
          data: {
            userId: dbUser.id,
            tokensUsed: totalTokens,
            requestsMade: 1,
            date: today,
          },
        });
      }

      console.log('LLM Completion telemetry processed:', {
        userId,
        modelId,
        totalTokens,
        cost,
        inputTokens,
        outputTokens
      });
    }

    // Store the raw telemetry event for analytics
    // You can create a telemetry_events table if you want to store all events
    // For now, we'll just log successful processing

    return NextResponse.json({
      success: true,
      message: 'Telemetry event processed successfully',
      eventType: event.type
    });

  } catch (error) {
    console.error('Telemetry event processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process telemetry event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
