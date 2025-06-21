import { database, shouldResetUsage } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions, or external service)
// Call this endpoint monthly to automatically reset user usage
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a trusted source (cron job)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid cron secret' },
        { status: 401 }
      );
    }

    console.log('[CRON] Starting monthly usage reset...');

    // Find all users who need their usage reset
    const usersToReset = await database.user.findMany({
      where: {
        OR: [
          { unitsResetDate: null }, // Users who have never had a reset
          { 
            unitsResetDate: { 
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
            } 
          }
        ]
      },
      select: {
        id: true,
        email: true,
        cubentUnitsUsed: true,
        unitsResetDate: true,
      }
    });

    console.log(`[CRON] Found ${usersToReset.length} users to potentially reset`);

    let resetCount = 0;
    const resetUsers: string[] = [];

    // Reset users who actually need reset based on business logic
    for (const user of usersToReset) {
      if (shouldResetUsage(user.unitsResetDate)) {
        try {
          await database.user.update({
            where: { id: user.id },
            data: {
              cubentUnitsUsed: 0,
              unitsResetDate: new Date(),
            },
          });

          resetCount++;
          resetUsers.push(user.email);
          
          console.log(`[CRON] Reset usage for user: ${user.email} (was: ${user.cubentUnitsUsed} units)`);
        } catch (error) {
          console.error(`[CRON] Failed to reset usage for user ${user.email}:`, error);
        }
      }
    }

    // Log the results
    console.log(`[CRON] Monthly usage reset completed. Reset ${resetCount} users.`);

    // Optional: Send notification to admin or monitoring service
    if (resetCount > 0) {
      // You could send an email, Slack notification, or webhook here
      console.log(`[CRON] Users reset: ${resetUsers.join(', ')}`);
    }

    return NextResponse.json({
      success: true,
      message: `Monthly usage reset completed successfully`,
      resetCount,
      totalUsersChecked: usersToReset.length,
      resetUsers: resetUsers.slice(0, 10), // Limit to first 10 for response size
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[CRON] Monthly usage reset failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Monthly usage reset failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check the status of the cron job (for monitoring)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid cron secret' },
        { status: 401 }
      );
    }

    // Get statistics about users and their reset status
    const totalUsers = await database.user.count();
    
    const usersNeedingReset = await database.user.count({
      where: {
        OR: [
          { unitsResetDate: null },
          { 
            unitsResetDate: { 
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
            } 
          }
        ]
      }
    });

    const recentResets = await database.user.count({
      where: {
        unitsResetDate: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    const averageUsage = await database.user.aggregate({
      _avg: {
        cubentUnitsUsed: true,
      }
    });

    const highUsageUsers = await database.user.count({
      where: {
        cubentUnitsUsed: {
          gte: 40 // Users who have used 80% or more of their limit
        }
      }
    });

    return NextResponse.json({
      status: 'healthy',
      statistics: {
        totalUsers,
        usersNeedingReset,
        recentResets,
        averageUsage: averageUsage._avg.cubentUnitsUsed || 0,
        highUsageUsers,
      },
      nextScheduledReset: 'Monthly on the 1st',
      lastChecked: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[CRON] Status check failed:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
