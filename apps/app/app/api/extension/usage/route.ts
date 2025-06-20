import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { calculateCubentUnits, getUsagePercentage } from '@repo/database/cubent-units';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const usageUpdateSchema = z.object({
  tokensUsed: z.number().min(0),
  requestsMade: z.number().min(0),
  costAccrued: z.number().min(0),
  modelId: z.string(),
  hasImages: z.boolean().optional().default(false),
  date: z.string().datetime().optional(),
});

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
    const { tokensUsed, requestsMade, costAccrued, modelId, hasImages, date } = usageUpdateSchema.parse(body);

    // Calculate Cubent Units for this request
    const cubentUnits = calculateCubentUnits(modelId, tokensUsed, hasImages);

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const usageDate = date ? new Date(date) : new Date();
    
    // Create or update usage metrics for the day
    const existingUsage = await database.usageMetrics.findFirst({
      where: {
        userId: dbUser.id,
        date: {
          gte: new Date(usageDate.getFullYear(), usageDate.getMonth(), usageDate.getDate()),
          lt: new Date(usageDate.getFullYear(), usageDate.getMonth(), usageDate.getDate() + 1),
        },
      },
    });

    if (existingUsage) {
      await database.usageMetrics.update({
        where: { id: existingUsage.id },
        data: {
          tokensUsed: existingUsage.tokensUsed + tokensUsed,
          requestsMade: existingUsage.requestsMade + requestsMade,
          costAccrued: existingUsage.costAccrued + costAccrued,
          cubentUnits: (existingUsage.cubentUnits || 0) + cubentUnits,
        },
      });
    } else {
      await database.usageMetrics.create({
        data: {
          userId: dbUser.id,
          tokensUsed,
          requestsMade,
          costAccrued,
          cubentUnits,
          date: usageDate,
        },
      });
    }

    // Update user's current month Cubent Units
    await database.user.update({
      where: { id: dbUser.id },
      data: {
        currentMonthCubentUnits: dbUser.currentMonthCubentUnits + cubentUnits,
      },
    });

    // Create detailed usage analytics
    await database.usageAnalytics.create({
      data: {
        userId: dbUser.id,
        modelId,
        tokensUsed,
        requestsMade,
        costAccrued,
        cubentUnits,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Usage metrics updated successfully',
    });

  } catch (error) {
    console.error('Usage update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const usageMetrics = await database.usageMetrics.findMany({
      where: {
        userId: dbUser.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    const totalUsage = usageMetrics.reduce(
      (acc, metric) => ({
        tokensUsed: acc.tokensUsed + metric.tokensUsed,
        requestsMade: acc.requestsMade + metric.requestsMade,
        costAccrued: acc.costAccrued + metric.costAccrued,
        cubentUnits: acc.cubentUnits + (metric.cubentUnits || 0),
      }),
      { tokensUsed: 0, requestsMade: 0, costAccrued: 0, cubentUnits: 0 }
    );

    // Calculate usage percentage
    const usagePercentage = getUsagePercentage(dbUser.currentMonthCubentUnits, dbUser.cubentUnitsLimit);

    return NextResponse.json({
      totalUsage,
      dailyUsage: usageMetrics,
      currentMonth: {
        cubentUnits: dbUser.currentMonthCubentUnits,
        cubentUnitsLimit: dbUser.cubentUnitsLimit,
        usagePercentage,
      },
      period: `${days} days`,
    });

  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
