import { auth } from '@repo/auth/server';
import { database, shouldResetUsage, calculateNextResetDate } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (you might want to implement proper admin check)
    const adminUser = await database.user.findUnique({
      where: { clerkId: userId },
      select: { email: true },
    });

    // For now, only allow specific admin emails (replace with your admin emails)
    const adminEmails = ['admin@cubent.dev', 'support@cubent.dev'];
    if (!adminUser || !adminEmails.includes(adminUser.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { resetType = 'all', userIds = [] } = body;

    let resetCount = 0;

    if (resetType === 'all') {
      // Reset all users who need reset
      const usersToReset = await database.user.findMany({
        where: {
          OR: [
            { unitsResetDate: null },
            { unitsResetDate: { lt: new Date() } }
          ]
        },
        select: { id: true, unitsResetDate: true }
      });

      for (const user of usersToReset) {
        if (shouldResetUsage(user.unitsResetDate || undefined)) {
          await database.user.update({
            where: { id: user.id },
            data: {
              cubentUnitsUsed: 0,
              unitsResetDate: new Date(),
            },
          });
          resetCount++;
        }
      }
    } else if (resetType === 'specific' && userIds.length > 0) {
      // Reset specific users
      const result = await database.user.updateMany({
        where: { id: { in: userIds } },
        data: {
          cubentUnitsUsed: 0,
          unitsResetDate: new Date(),
        },
      });
      resetCount = result.count;
    } else if (resetType === 'overdue') {
      // Reset only overdue users
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const result = await database.user.updateMany({
        where: {
          OR: [
            { unitsResetDate: null },
            { unitsResetDate: { lt: oneMonthAgo } }
          ]
        },
        data: {
          cubentUnitsUsed: 0,
          unitsResetDate: new Date(),
        },
      });
      resetCount = result.count;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully reset usage for ${resetCount} users`,
      resetCount,
      resetType,
    });

  } catch (error) {
    console.error('Usage reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check which users need reset
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminUser = await database.user.findUnique({
      where: { clerkId: userId },
      select: { email: true },
    });

    const adminEmails = ['admin@cubent.dev', 'support@cubent.dev'];
    if (!adminUser || !adminEmails.includes(adminUser.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const checkType = searchParams.get('type') || 'overdue';

    let users;
    const now = new Date();

    if (checkType === 'all') {
      users = await database.user.findMany({
        select: {
          id: true,
          email: true,
          cubentUnitsUsed: true,
          cubentUnitsLimit: true,
          unitsResetDate: true,
        },
        orderBy: { unitsResetDate: 'asc' },
      });
    } else if (checkType === 'overdue') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      users = await database.user.findMany({
        where: {
          OR: [
            { unitsResetDate: null },
            { unitsResetDate: { lt: oneMonthAgo } }
          ]
        },
        select: {
          id: true,
          email: true,
          cubentUnitsUsed: true,
          cubentUnitsLimit: true,
          unitsResetDate: true,
        },
        orderBy: { unitsResetDate: 'asc' },
      });
    } else {
      users = await database.user.findMany({
        where: {
          unitsResetDate: {
            not: null,
            lt: now
          }
        },
        select: {
          id: true,
          email: true,
          cubentUnitsUsed: true,
          cubentUnitsLimit: true,
          unitsResetDate: true,
        },
        orderBy: { unitsResetDate: 'asc' },
      });
    }

    const usersWithResetInfo = users.map(user => ({
      ...user,
      needsReset: shouldResetUsage(user.unitsResetDate || undefined),
      nextResetDate: calculateNextResetDate(user.unitsResetDate || undefined),
      daysSinceLastReset: user.unitsResetDate 
        ? Math.floor((now.getTime() - user.unitsResetDate.getTime()) / (1000 * 60 * 60 * 24))
        : null,
    }));

    return NextResponse.json({
      users: usersWithResetInfo,
      totalUsers: users.length,
      usersNeedingReset: usersWithResetInfo.filter(u => u.needsReset).length,
      checkType,
    });

  } catch (error) {
    console.error('Usage check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
