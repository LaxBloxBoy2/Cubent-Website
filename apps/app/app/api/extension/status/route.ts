import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextResponse } from 'next/server';

/**
 * Get extension connection status and health
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get active extension sessions
    const activeSessions = await database.extensionSession.findMany({
      where: {
        userId: dbUser.id,
        isActive: true,
        lastActiveAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Active within last 5 minutes
        },
      },
      orderBy: { lastActiveAt: 'desc' },
    });

    // Get recent usage (last 24 hours)
    const recentUsage = await database.usageMetrics.aggregate({
      where: {
        userId: dbUser.id,
        date: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      _sum: {
        tokensUsed: true,
        requestsMade: true,
        costAccrued: true,
      },
    });

    // Get total usage
    const totalUsage = await database.usageMetrics.aggregate({
      where: {
        userId: dbUser.id,
      },
      _sum: {
        tokensUsed: true,
        requestsMade: true,
        costAccrued: true,
      },
    });

    // Determine connection status
    const isConnected = activeSessions.length > 0;
    const lastActiveSession = activeSessions[0];

    const response = {
      status: {
        connected: isConnected,
        lastActive: lastActiveSession?.lastActiveAt || null,
        activeSessions: activeSessions.length,
        health: isConnected ? 'healthy' : 'disconnected',
      },
      user: {
        id: userId,
        subscriptionTier: dbUser.subscriptionTier || 'FREE',
        subscriptionStatus: dbUser.subscriptionStatus || 'ACTIVE',
        extensionEnabled: dbUser.extensionEnabled || false,
      },
      usage: {
        recent24h: {
          tokensUsed: recentUsage._sum.tokensUsed || 0,
          requestsMade: recentUsage._sum.requestsMade || 0,
          costAccrued: recentUsage._sum.costAccrued || 0,
        },
        total: {
          tokensUsed: totalUsage._sum.tokensUsed || 0,
          requestsMade: totalUsage._sum.requestsMade || 0,
          costAccrued: totalUsage._sum.costAccrued || 0,
        },
      },
      sessions: activeSessions.map(session => ({
        id: session.id,
        sessionId: session.sessionId,
        extensionVersion: session.extensionVersion,
        vscodeVersion: session.vscodeVersion,
        platform: session.platform,
        lastActiveAt: session.lastActiveAt,
        tokensUsed: session.tokensUsed,
        requestsMade: session.requestsMade,
      })),
      serverTime: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Extension status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update extension status (heartbeat)
 */
export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user's last active timestamp
    await database.user.update({
      where: { id: dbUser.id },
      data: {
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Heartbeat received',
    });
  } catch (error) {
    console.error('Extension heartbeat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
