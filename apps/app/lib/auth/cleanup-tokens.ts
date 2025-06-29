import { database } from '@repo/database';
import { log } from '@repo/observability/log';

/**
 * Clean up expired pending login tokens
 * This should be called periodically (e.g., via a cron job)
 */
export const cleanupExpiredTokens = async (): Promise<number> => {
  try {
    const result = await database.pendingLogin.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    if (result.count > 0) {
      log.info('Cleaned up expired login tokens', { count: result.count });
    }

    return result.count;
  } catch (error) {
    log.error('Failed to cleanup expired tokens', { error });
    throw error;
  }
};

/**
 * Clean up tokens older than a specific age (default: 30 days)
 * Changed from 1 hour to 30 days to match JWT token lifetime
 */
export const cleanupOldTokens = async (maxAgeMinutes = 30 * 24 * 60): Promise<number> => {
  try {
    const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000);
    
    const result = await database.pendingLogin.deleteMany({
      where: {
        createdAt: { lt: cutoffTime },
      },
    });

    if (result.count > 0) {
      log.info('Cleaned up old login tokens', { count: result.count, maxAgeMinutes });
    }

    return result.count;
  } catch (error) {
    log.error('Failed to cleanup old tokens', { error });
    throw error;
  }
};
