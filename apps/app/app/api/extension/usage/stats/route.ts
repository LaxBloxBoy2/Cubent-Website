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

    // Add some sample data if user has no usage yet (for demo purposes)
    const sampleData = {
      totalCubentUnits: 12.5,
      totalMessages: 45,
      userLimit: 50,
      subscriptionTier: 'free_trial',
      monthlyUsage: {
        cubentUnits: 8.2,
        messages: 28
      }
    };

    // Use real data if available, otherwise use sample data
    const hasRealData = (dbUser.cubentUnitsUsed && dbUser.cubentUnitsUsed > 0) || totalMessages > 0;

    return NextResponse.json({
      success: true,
      totalCubentUnits: hasRealData ? (dbUser.cubentUnitsUsed || 0) : sampleData.totalCubentUnits,
      totalMessages: hasRealData ? totalMessages : sampleData.totalMessages,
      userLimit: dbUser.cubentUnitsLimit || 50,
      subscriptionTier: dbUser.subscriptionTier || 'free_trial',
      monthlyUsage: {
        cubentUnits: hasRealData ? (monthlyUsage._sum.cubentUnitsUsed || 0) : sampleData.monthlyUsage.cubentUnits,
        messages: hasRealData ? (monthlyUsage._sum.requestsMade || 0) : sampleData.monthlyUsage.messages
      },
      isDemo: !hasRealData // Flag to indicate this is demo data
    });

  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
