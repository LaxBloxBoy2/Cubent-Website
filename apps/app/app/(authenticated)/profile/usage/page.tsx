import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { UsageAnalytics } from './components/usage-analytics';

const title = 'Cubent Units Usage';
const description = 'View your VS Code extension usage statistics and analytics.';

export const metadata: Metadata = createMetadata({ title, description });

const UsagePage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  // Find or create user in database
  let dbUser = await database.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      cubentUnitsUsed: true,
      cubentUnitsLimit: true,
      subscriptionTier: true,
      usageMetrics: {
        orderBy: { date: 'desc' },
        take: 30, // Last 30 days for chart
        select: {
          date: true,
          cubentUnitsUsed: true,
          requestsMade: true,
        }
      }
    }
  });

  if (!dbUser) {
    // Create new user automatically for social login users
    const newUser = await database.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
        picture: user.imageUrl,
      },
      select: {
        id: true,
        cubentUnitsUsed: true,
        cubentUnitsLimit: true,
        subscriptionTier: true,
        usageMetrics: {
          orderBy: { date: 'desc' },
          take: 30,
          select: {
            date: true,
            cubentUnitsUsed: true,
            requestsMade: true,
          }
        }
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

  // Generate sample chart data if no real data exists
  const generateSampleChartData = () => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      data.push({
        date,
        cubentUnitsUsed: Math.random() * 2 + 0.1, // Random between 0.1 and 2.1
        requestsMade: Math.floor(Math.random() * 5) + 1, // Random between 1 and 5
      });
    }
    return data;
  };

  const hasRealData = (dbUser.cubentUnitsUsed && dbUser.cubentUnitsUsed > 0) || totalMessages > 0;

  const usageData = {
    totalCubentUnits: hasRealData ? (dbUser.cubentUnitsUsed || 0) : 12.5,
    totalMessages: hasRealData ? totalMessages : 45,
    userLimit: dbUser.cubentUnitsLimit || 50,
    subscriptionTier: dbUser.subscriptionTier || 'free_trial',
    chartData: hasRealData ? dbUser.usageMetrics : generateSampleChartData(),
    user: {
      name: user.firstName || 'User',
      email: user.emailAddresses[0]?.emailAddress || '',
      picture: user.imageUrl,
    },
    isDemo: !hasRealData
  };

  return <UsageAnalytics initialData={usageData} />;
};

export default UsagePage;