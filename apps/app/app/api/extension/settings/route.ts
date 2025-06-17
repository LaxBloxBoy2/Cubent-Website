import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const settingsUpdateSchema = z.object({
  extensionSettings: z.record(z.any()).optional(),
  preferences: z.record(z.any()).optional(),
});

export async function GET() {
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
      select: {
        extensionSettings: true,
        preferences: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      extensionSettings: dbUser.extensionSettings || {},
      preferences: dbUser.preferences || {},
    });

  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { extensionSettings, preferences } = settingsUpdateSchema.parse(body);

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    if (extensionSettings !== undefined) {
      updateData.extensionSettings = extensionSettings;
    }
    
    if (preferences !== undefined) {
      updateData.preferences = preferences;
    }

    const updatedUser = await database.user.update({
      where: { id: dbUser.id },
      data: updateData,
      select: {
        extensionSettings: true,
        preferences: true,
      },
    });

    return NextResponse.json({
      success: true,
      extensionSettings: updatedUser.extensionSettings,
      preferences: updatedUser.preferences,
    });

  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
