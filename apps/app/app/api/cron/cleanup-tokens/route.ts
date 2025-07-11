import { cleanupExpiredTokens, cleanupOldTokens } from '@/lib/auth/cleanup-tokens';
import { parseError } from '@repo/observability/error';
import { log } from '@repo/observability/log';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    // Verify this is a legitimate cron request (Vercel cron or authorized request)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const ip = request.headers.get('x-forwarded-for') ||
                 request.headers.get('x-real-ip') ||
                 'unknown';
      log.warn('Unauthorized cron request', {
        ip,
        userAgent: request.headers.get('user-agent')
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clean up expired tokens (past expiration time)
    const expiredCount = await cleanupExpiredTokens();

    // Clean up old tokens (older than 30 days, regardless of expiration)
    // Changed from 2 hours to 30 days to match JWT token lifetime
    const oldCount = await cleanupOldTokens(30 * 24 * 60); // 30 days in minutes

    const totalCleaned = expiredCount + oldCount;

    log.info('Token cleanup completed', {
      expiredTokens: expiredCount,
      oldTokens: oldCount,
      totalCleaned,
    });

    return NextResponse.json({
      success: true,
      cleaned: {
        expired: expiredCount,
        old: oldCount,
        total: totalCleaned,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = parseError(error);
    log.error('Token cleanup failed', { error: message });

    return NextResponse.json(
      { error: 'Cleanup failed', message },
      { status: 500 }
    );
  }
};
