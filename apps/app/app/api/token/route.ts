import { database } from '@repo/database';
import { parseError } from '@repo/observability/error';
import { log } from '@repo/observability/log';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const tokenQuerySchema = z.object({
  device_id: z.string().min(1, 'Device ID is required'),
  state: z.string().min(1, 'State parameter is required'),
});

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
};

export const GET = async (request: NextRequest) => {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      log.warn('Rate limit exceeded for token endpoint', { ip });
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      device_id: searchParams.get('device_id'),
      state: searchParams.get('state'),
    };

    const { device_id: deviceId, state } = tokenQuerySchema.parse(queryParams);

    // Clean up expired tokens first
    await database.pendingLogin.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    // Find the pending login
    const pendingLogin = await database.pendingLogin.findFirst({
      where: {
        deviceId,
        state,
        expiresAt: { gt: new Date() }, // Not expired
      },
    });

    if (!pendingLogin) {
      log.info('Token not found or expired', {
        deviceId: deviceId.slice(0, 8) + '...',
        state: state.slice(0, 8) + '...',
        ip,
      });
      
      return NextResponse.json(
        { error: 'Not found', message: 'Token not found or expired' },
        { status: 404 }
      );
    }

    // Delete the pending login (one-time use)
    await database.pendingLogin.delete({
      where: { id: pendingLogin.id },
    });

    log.info('Token retrieved successfully', {
      deviceId: deviceId.slice(0, 8) + '...',
      state: state.slice(0, 8) + '...',
      ip,
    });

    return NextResponse.json({
      token: pendingLogin.token,
      success: true,
    });
  } catch (error) {
    const message = parseError(error);
    log.error('Token retrieval failed', { error: message });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', message: error.errors[0]?.message || 'Invalid parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to retrieve token' },
      { status: 500 }
    );
  }
};
