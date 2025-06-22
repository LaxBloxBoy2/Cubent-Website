import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find or create user in database
    let dbUser = await database.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        cubentUnitsUsed: true,
        cubentUnitsLimit: true,
        subscriptionTier: true,
      }
    });

    if (!dbUser) {
      // Create new user automatically for social login users
      const newUser = await database.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
          picture: clerkUser.imageUrl,
        },
        select: {
          id: true,
          cubentUnitsUsed: true,
          cubentUnitsLimit: true,
          subscriptionTier: true,
        }
      });
      dbUser = newUser;
    }

    // Get total messages from usage analytics
    const totalMessages = await database.usageAnalytics.count({
      where: {
        userId: dbUser.id
      }
    });

    // Get current month usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyUsage = await database.usageMetrics.aggregate({
      where: {
        userId: dbUser.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: {
        cubentUnitsUsed: true,
        requestsMade: true
      }
    });

    return NextResponse.json({
      success: true,
      totalCubentUnits: dbUser.cubentUnitsUsed || 0,
      totalMessages: totalMessages,
      userLimit: dbUser.cubentUnitsLimit || 50,
      subscriptionTier: dbUser.subscriptionTier || 'free_trial',
      monthlyUsage: {
        cubentUnits: monthlyUsage._sum.cubentUnitsUsed || 0,
        messages: monthlyUsage._sum.requestsMade || 0
      }
    });

  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
