import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new API key
    const newApiKey = `cubent_${randomBytes(32).toString('hex')}`;

    // Update user with new API key
    await database.user.update({
      where: { id: dbUser.id },
      data: { 
        extensionApiKey: newApiKey,
        // Invalidate all existing sessions to force reconnection
      },
    });

    // Optionally, deactivate all existing sessions to force reconnection
    await database.extensionSession.updateMany({
      where: { userId: dbUser.id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'New API key generated successfully',
      apiKey: newApiKey,
    });

  } catch (error) {
    console.error('API key generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
