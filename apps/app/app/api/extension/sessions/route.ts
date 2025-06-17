import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const sessionCreateSchema = z.object({
  sessionId: z.string().min(1),
  extensionVersion: z.string().optional(),
  vscodeVersion: z.string().optional(),
  platform: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const sessionUpdateSchema = z.object({
  sessionId: z.string().min(1),
  isActive: z.boolean().optional(),
  tokensUsed: z.number().int().min(0).optional(),
  requestsMade: z.number().int().min(0).optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Create or update extension session
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = sessionCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid session data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { sessionId, extensionVersion, vscodeVersion, platform, metadata } = validation.data;

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

    // Create or update session
    const session = await database.extensionSession.upsert({
      where: {
        userId_sessionId: {
          userId: dbUser.id,
          sessionId,
        },
      },
      update: {
        isActive: true,
        lastActiveAt: new Date(),
        extensionVersion,
        vscodeVersion,
        platform,
        metadata,
      },
      create: {
        userId: dbUser.id,
        sessionId,
        isActive: true,
        extensionVersion,
        vscodeVersion,
        platform,
        metadata,
        tokensUsed: 0,
        requestsMade: 0,
        createdAt: new Date(),
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        sessionId: session.sessionId,
        isActive: session.isActive,
        createdAt: session.createdAt,
        lastActiveAt: session.lastActiveAt,
      },
    });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update extension session
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = sessionUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid session update data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { sessionId, isActive, tokensUsed, requestsMade, metadata } = validation.data;

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

    // Update session
    const updateData: any = {
      lastActiveAt: new Date(),
    };

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }
    if (typeof tokensUsed === 'number') {
      updateData.tokensUsed = { increment: tokensUsed };
    }
    if (typeof requestsMade === 'number') {
      updateData.requestsMade = { increment: requestsMade };
    }
    if (metadata) {
      updateData.metadata = metadata;
    }

    const session = await database.extensionSession.update({
      where: {
        userId_sessionId: {
          userId: dbUser.id,
          sessionId,
        },
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        sessionId: session.sessionId,
        isActive: session.isActive,
        tokensUsed: session.tokensUsed,
        requestsMade: session.requestsMade,
        lastActiveAt: session.lastActiveAt,
      },
    });
  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get user's extension sessions
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

    // Get all sessions for the user
    const sessions = await database.extensionSession.findMany({
      where: { userId: dbUser.id },
      orderBy: { lastActiveAt: 'desc' },
    });

    const activeSessions = sessions.filter(s => s.isActive);
    const totalSessions = sessions.length;

    return NextResponse.json({
      sessions: sessions.map(session => ({
        id: session.id,
        sessionId: session.sessionId,
        isActive: session.isActive,
        extensionVersion: session.extensionVersion,
        vscodeVersion: session.vscodeVersion,
        platform: session.platform,
        tokensUsed: session.tokensUsed,
        requestsMade: session.requestsMade,
        createdAt: session.createdAt,
        lastActiveAt: session.lastActiveAt,
        metadata: session.metadata,
      })),
      summary: {
        totalSessions,
        activeSessions: activeSessions.length,
        lastActiveSession: sessions[0]?.lastActiveAt || null,
      },
    });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Terminate extension session
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const terminateAll = searchParams.get('all') === 'true';

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

    if (terminateAll) {
      // Terminate all active sessions
      const result = await database.extensionSession.updateMany({
        where: {
          userId: dbUser.id,
          isActive: true,
        },
        data: {
          isActive: false,
          lastActiveAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Terminated ${result.count} active sessions`,
        terminatedSessions: result.count,
      });
    } else if (sessionId) {
      // Terminate specific session
      const session = await database.extensionSession.update({
        where: {
          userId_sessionId: {
            userId: dbUser.id,
            sessionId,
          },
        },
        data: {
          isActive: false,
          lastActiveAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Session terminated successfully',
        session: {
          id: session.id,
          sessionId: session.sessionId,
          isActive: session.isActive,
          lastActiveAt: session.lastActiveAt,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Session ID required or use ?all=true to terminate all sessions' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Session termination error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
