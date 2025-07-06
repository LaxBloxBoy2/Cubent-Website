import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get user's Cubent Units information
 * Returns current usage, limit, and reset date
 */
export async function GET(request: NextRequest) {
  try {
    // Check for Bearer token in Authorization header
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        // Try to validate as Clerk JWT directly
        const { clerkClient } = await import('@repo/auth/server');
        const client = await clerkClient();
        const session = await client.sessions.getSession(token);
        userId = session.userId;
        console.log('Units API - Clerk JWT validation successful:', { userId });
      } catch (clerkError) {
        console.log('Units API - Clerk JWT failed, trying PendingLogin:', clerkError);

        // Fallback: Check PendingLogin table
        const pendingLogin = await database.pendingLogin.findFirst({
          where: { token },
        });

        if (pendingLogin?.userId) {
          userId = pendingLogin.userId;
          console.log('Units API - PendingLogin validation successful:', { userId });
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await database.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        email: true,
        cubentUnitsUsed: true,
        cubentUnitsLimit: true,
        unitsResetDate: true,
        subscriptionTier: true,
        subscriptionStatus: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate reset date if not set (monthly reset)
    let resetDate = user.unitsResetDate;
    if (!resetDate) {
      const now = new Date();
      resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); // First day of next month
    }

    return NextResponse.json({
      used: user.cubentUnitsUsed,
      limit: user.cubentUnitsLimit,
      resetDate: resetDate.toISOString(),
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
      percentage: (user.cubentUnitsUsed / user.cubentUnitsLimit) * 100,
    });

  } catch (error) {
    console.error('Units API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
