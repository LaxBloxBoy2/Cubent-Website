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

  const usageData = {
    totalCubentUnits: dbUser.cubentUnitsUsed || 0,
    totalMessages: totalMessages,
    userLimit: dbUser.cubentUnitsLimit || 50,
    subscriptionTier: dbUser.subscriptionTier || 'free_trial',
    chartData: dbUser.usageMetrics,
    user: {
      name: user.firstName || 'User',
      email: user.emailAddresses[0]?.emailAddress || '',
      picture: user.imageUrl,
    }
  };

  return <UsageAnalytics initialData={usageData} />;
};

export default UsagePage;