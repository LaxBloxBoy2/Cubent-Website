import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const connectRequestSchema = z.object({
  sessionId: z.string(),
  extensionVersion: z.string(),
  platform: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId, extensionVersion, platform } = connectRequestSchema.parse(body);

    // Find or create user in database
    let dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      // Create new user automatically for social login users
      dbUser = await database.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
          picture: clerkUser.imageUrl,
        },
      });
    }

    if (!dbUser.termsAccepted) {
      return NextResponse.json(
        { 
          error: 'Terms not accepted',
          requiresTermsAcceptance: true,
          redirectUrl: '/terms'
        },
        { status: 403 }
      );
    }

    // Generate API key if not exists
    let apiKey = dbUser.extensionApiKey;
    if (!apiKey) {
      apiKey = `cubent_${randomBytes(32).toString('hex')}`;
      await database.user.update({
        where: { id: dbUser.id },
        data: { extensionApiKey: apiKey },
      });
    }

    // Create or update extension session using compound unique key
    // Fixed: Use userId_sessionId compound key instead of sessionId alone
    await database.extensionSession.upsert({
      where: {
        userId_sessionId: {
          userId: dbUser.id,
          sessionId,
        },
      },
      update: {
        isActive: true,
        lastActiveAt: new Date(), // Updated field name from lastSeen
      },
      create: {
        userId: dbUser.id,
        sessionId,
        isActive: true,
        lastActiveAt: new Date(),
      },
    });

    // Update last extension sync
    await database.user.update({
      where: { id: dbUser.id },
      data: { lastExtensionSync: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: 'Extension connected successfully',
      apiKey,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        subscriptionTier: dbUser.subscriptionTier,
        subscriptionStatus: dbUser.subscriptionStatus,
      },
      settings: {
        extensionSettings: dbUser.extensionSettings || {},
        preferences: dbUser.preferences || {},
      },
    });

  } catch (error) {
    console.error('Extension connect error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (sessionId) {
      // Disconnect specific session
      await database.extensionSession.updateMany({
        where: {
          userId: dbUser.id,
          sessionId,
        },
        data: {
          isActive: false,
        },
      });
    } else {
      // Disconnect all sessions
      await database.extensionSession.updateMany({
        where: {
          userId: dbUser.id,
        },
        data: {
          isActive: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Extension disconnected successfully',
    });

  } catch (error) {
    console.error('Extension disconnect error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
