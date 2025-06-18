import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get user subscription information
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

    // Get usage statistics for current billing period
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyUsage = await database.usageMetrics.aggregate({
      where: {
        userId: dbUser.id,
        date: {
          gte: startOfMonth,
        },
      },
      _sum: {
        tokensUsed: true,
        requestsMade: true,
        costAccrued: true,
      },
    });

    // Define subscription tiers and limits
    const subscriptionTiers = {
      FREE: {
        name: 'Free',
        monthlyTokenLimit: 10000,
        monthlyRequestLimit: 100,
        monthlyCostLimit: 5.00,
        features: ['Basic AI assistance', 'Limited models'],
      },
      PRO: {
        name: 'Pro',
        monthlyTokenLimit: 100000,
        monthlyRequestLimit: 1000,
        monthlyCostLimit: 50.00,
        features: ['Advanced AI assistance', 'All models', 'Priority support'],
      },
      ENTERPRISE: {
        name: 'Enterprise',
        monthlyTokenLimit: -1, // Unlimited
        monthlyRequestLimit: -1, // Unlimited
        monthlyCostLimit: -1, // Unlimited
        features: ['Unlimited usage', 'Custom models', 'Dedicated support'],
      },
    };

    const currentTier = dbUser.subscriptionTier || 'FREE';
    const tierInfo = subscriptionTiers[currentTier as keyof typeof subscriptionTiers];

    const response = {
      subscription: {
        tier: currentTier,
        status: dbUser.subscriptionStatus || 'ACTIVE',
        name: tierInfo.name,
        features: tierInfo.features,
        limits: {
          monthlyTokenLimit: tierInfo.monthlyTokenLimit,
          monthlyRequestLimit: tierInfo.monthlyRequestLimit,
          monthlyCostLimit: tierInfo.monthlyCostLimit,
        },
        billingPeriod: {
          start: startOfMonth,
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        },
      },
      usage: {
        current: {
          tokensUsed: monthlyUsage._sum.tokensUsed || 0,
          requestsMade: monthlyUsage._sum.requestsMade || 0,
          costAccrued: monthlyUsage._sum.costAccrued || 0,
        },
        percentages: {
          tokens: tierInfo.monthlyTokenLimit > 0 
            ? Math.round(((monthlyUsage._sum.tokensUsed || 0) / tierInfo.monthlyTokenLimit) * 100)
            : 0,
          requests: tierInfo.monthlyRequestLimit > 0
            ? Math.round(((monthlyUsage._sum.requestsMade || 0) / tierInfo.monthlyRequestLimit) * 100)
            : 0,
          cost: tierInfo.monthlyCostLimit > 0
            ? Math.round(((monthlyUsage._sum.costAccrued || 0) / tierInfo.monthlyCostLimit) * 100)
            : 0,
        },
      },
      canUpgrade: currentTier !== 'ENTERPRISE',
      upgradeUrl: currentTier === 'FREE' ? '/pricing' : '/billing',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Check if user can make a request based on subscription limits
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
    const { tokensRequested = 0, estimatedCost = 0 } = body;

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

    const currentTier = dbUser.subscriptionTier || 'FREE';
    
    // Get current month usage
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyUsage = await database.usageMetrics.aggregate({
      where: {
        userId: dbUser.id,
        date: {
          gte: startOfMonth,
        },
      },
      _sum: {
        tokensUsed: true,
        requestsMade: true,
        costAccrued: true,
      },
    });

    // Define limits based on tier
    const limits = {
      FREE: { tokens: 10000, requests: 100, cost: 5.00 },
      PRO: { tokens: 100000, requests: 1000, cost: 50.00 },
      ENTERPRISE: { tokens: -1, requests: -1, cost: -1 }, // Unlimited
    };

    const tierLimits = limits[currentTier as keyof typeof limits];
    const currentUsage = {
      tokens: monthlyUsage._sum.tokensUsed || 0,
      requests: monthlyUsage._sum.requestsMade || 0,
      cost: monthlyUsage._sum.costAccrued || 0,
    };

    // Check limits
    const checks = {
      tokens: tierLimits.tokens === -1 || (currentUsage.tokens + tokensRequested) <= tierLimits.tokens,
      requests: tierLimits.requests === -1 || (currentUsage.requests + 1) <= tierLimits.requests,
      cost: tierLimits.cost === -1 || (currentUsage.cost + estimatedCost) <= tierLimits.cost,
    };

    const canProceed = checks.tokens && checks.requests && checks.cost;

    let reason = '';
    if (!checks.tokens) reason = 'Monthly token limit exceeded';
    else if (!checks.requests) reason = 'Monthly request limit exceeded';
    else if (!checks.cost) reason = 'Monthly cost limit exceeded';

    return NextResponse.json({
      allowed: canProceed,
      reason: canProceed ? null : reason,
      limits: tierLimits,
      currentUsage,
      remaining: {
        tokens: tierLimits.tokens === -1 ? -1 : Math.max(0, tierLimits.tokens - currentUsage.tokens),
        requests: tierLimits.requests === -1 ? -1 : Math.max(0, tierLimits.requests - currentUsage.requests),
        cost: tierLimits.cost === -1 ? -1 : Math.max(0, tierLimits.cost - currentUsage.cost),
      },
      upgradeRequired: !canProceed && currentTier !== 'ENTERPRISE',
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
