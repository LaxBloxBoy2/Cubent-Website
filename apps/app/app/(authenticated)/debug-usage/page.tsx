import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

const title = 'Debug Usage Data';
const description = 'Debug page to check usage data in database.';

export const metadata: Metadata = createMetadata({ title, description });

const DebugUsagePage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  // Find user in database
  const dbUser = await database.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      clerkId: true,
      email: true,
      name: true,
      cubentUnitsUsed: true,
      cubentUnitsLimit: true,
      subscriptionTier: true,
      lastActiveAt: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  // Get usage analytics
  const usageAnalytics = await database.usageAnalytics.findMany({
    where: {
      userId: dbUser?.id
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      modelId: true,
      cubentUnitsUsed: true,
      requestsMade: true,
      createdAt: true,
      metadata: true,
    }
  });

  // Get usage metrics
  const usageMetrics = await database.usageMetrics.findMany({
    where: {
      userId: dbUser?.id
    },
    orderBy: { date: 'desc' },
    take: 10,
    select: {
      id: true,
      cubentUnitsUsed: true,
      requestsMade: true,
      date: true,
    }
  });

  // Get total counts
  const totalAnalyticsCount = await database.usageAnalytics.count({
    where: {
      userId: dbUser?.id
    }
  });

  const totalMetricsCount = await database.usageMetrics.count({
    where: {
      userId: dbUser?.id
    }
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Debug Usage Data</h1>
        <p className="text-muted-foreground mt-2">
          Check what usage data is stored in the database
        </p>
      </div>

      <div className="grid gap-6">
        {/* User Info */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <p><strong>Clerk ID:</strong> {userId}</p>
            <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
            <p><strong>DB User Found:</strong> {dbUser ? 'Yes' : 'No'}</p>
            {dbUser && (
              <>
                <p><strong>DB User ID:</strong> {dbUser.id}</p>
                <p><strong>Cubent Units Used:</strong> {dbUser.cubentUnitsUsed}</p>
                <p><strong>Cubent Units Limit:</strong> {dbUser.cubentUnitsLimit}</p>
                <p><strong>Subscription Tier:</strong> {dbUser.subscriptionTier}</p>
                <p><strong>Last Active:</strong> {dbUser.lastActiveAt?.toISOString() || 'Never'}</p>
                <p><strong>Created:</strong> {dbUser.createdAt?.toISOString()}</p>
                <p><strong>Updated:</strong> {dbUser.updatedAt?.toISOString()}</p>
              </>
            )}
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Usage Analytics</h2>
          <p className="mb-4"><strong>Total Records:</strong> {totalAnalyticsCount}</p>
          {usageAnalytics.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-medium">Recent 10 Records:</h3>
              {usageAnalytics.map((record) => (
                <div key={record.id} className="bg-muted p-3 rounded">
                  <p><strong>Model:</strong> {record.modelId}</p>
                  <p><strong>Cubent Units:</strong> {record.cubentUnitsUsed}</p>
                  <p><strong>Requests:</strong> {record.requestsMade}</p>
                  <p><strong>Created:</strong> {record.createdAt.toISOString()}</p>
                  <p><strong>Metadata:</strong> {JSON.stringify(record.metadata)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No usage analytics records found</p>
          )}
        </div>

        {/* Usage Metrics */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Usage Metrics</h2>
          <p className="mb-4"><strong>Total Records:</strong> {totalMetricsCount}</p>
          {usageMetrics.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-medium">Recent 10 Records:</h3>
              {usageMetrics.map((record) => (
                <div key={record.id} className="bg-muted p-3 rounded">
                  <p><strong>Cubent Units:</strong> {record.cubentUnitsUsed}</p>
                  <p><strong>Requests:</strong> {record.requestsMade}</p>
                  <p><strong>Date:</strong> {record.date.toISOString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No usage metrics records found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugUsagePage;
