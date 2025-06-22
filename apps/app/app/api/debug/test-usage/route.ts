import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';

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

    // Find or create user in database
    let dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      // Create new user automatically
      dbUser = await database.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
          picture: clerkUser.imageUrl,
        },
      });
    }

    // Add test usage data
    const testCubentUnits = 1.5;
    const testMessageCount = 1;

    // Update user's total Cubent Units used
    await database.user.update({
      where: { id: dbUser.id },
      data: {
        cubentUnitsUsed: {
          increment: testCubentUnits
        },
        lastActiveAt: new Date(),
      },
    });

    // Create usage analytics record
    await database.usageAnalytics.create({
      data: {
        userId: dbUser.id,
        modelId: 'test-model-gpt-4',
        cubentUnitsUsed: testCubentUnits,
        requestsMade: testMessageCount,
        metadata: {
          provider: 'test',
          configName: 'test-config',
          timestamp: Date.now()
        }
      },
    });

    // Update daily usage metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMetrics = await database.usageMetrics.findFirst({
      where: {
        userId: dbUser.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    if (existingMetrics) {
      await database.usageMetrics.update({
        where: { id: existingMetrics.id },
        data: {
          cubentUnitsUsed: {
            increment: testCubentUnits
          },
          requestsMade: {
            increment: testMessageCount
          }
        },
      });
    } else {
      await database.usageMetrics.create({
        data: {
          userId: dbUser.id,
          cubentUnitsUsed: testCubentUnits,
          requestsMade: testMessageCount,
          date: today,
        },
      });
    }

    // Get updated user data
    const updatedUser = await database.user.findUnique({
      where: { id: dbUser.id },
      select: {
        cubentUnitsUsed: true,
        cubentUnitsLimit: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test usage data added successfully',
      testData: {
        cubentUnitsAdded: testCubentUnits,
        messagesAdded: testMessageCount,
        totalCubentUnits: updatedUser?.cubentUnitsUsed || 0,
        userLimit: updatedUser?.cubentUnitsLimit || 50,
      }
    });

  } catch (error) {
    console.error('Test usage error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
