import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';

export async function GET(request: NextRequest) {
  try {
    // Check for Bearer token in Authorization header (for extension)
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    let clerkUser: any = null;

    if (authHeader?.startsWith('Bearer ')) {
      // Extension is using Bearer token authentication
      const token = authHeader.substring(7);

      // Find the pending login with this token to get the user
      const pendingLogin = await database.pendingLogin.findFirst({
        where: {
          token,
          expiresAt: { gt: new Date() }, // Not expired
        },
      });

      if (pendingLogin) {
        // Token is valid, get the user ID from the session
        try {
          const { clerkClient } = await import('@repo/auth/server');
          const client = await clerkClient();
          const session = await client.sessions.getSession(token);
          userId = session.userId;
          // For extension requests, we don't need the full clerkUser object
          clerkUser = { userId };
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
    } else {
      // Fallback to regular Clerk auth for web requests
      const authResult = await auth();
      userId = authResult.userId;
      clerkUser = await currentUser();
    }

    if (!userId) {
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
      // For extension requests, we might not have full user info, so just return error
      if (authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'User not found in database. Please sign in to the web app first.' },
          { status: 404 }
        );
      }

      // Create new user automatically for web requests only
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
