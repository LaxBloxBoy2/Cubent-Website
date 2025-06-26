import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ExtensionConnectionStatus } from './components/extension-connection-status';
import { QuickStats } from './components/quick-stats';

const title = 'Profile';
const description = 'Manage your account and extension settings.';

export const metadata: Metadata = createMetadata({ title, description });

const ProfilePage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  // Find or create user in database using upsert to handle duplicates
  const dbUser = await database.user.upsert({
    where: { clerkId: userId },
    update: {
      // Update existing user with latest info from Clerk
      email: user.emailAddresses[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
      picture: user.imageUrl,
    },
    create: {
      clerkId: userId,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
      picture: user.imageUrl,
    },
    include: {
      extensionSessions: {
        where: { isActive: true },
        orderBy: { lastActiveAt: 'desc' },
      },
      usageMetrics: {
        orderBy: { date: 'desc' },
        take: 30, // Last 30 days
      },
    },
  });

  const isExtensionConnected = dbUser.extensionSessions.length > 0;
  const totalUsage = dbUser.usageMetrics.reduce(
    (acc, metric) => ({
      tokensUsed: acc.tokensUsed + metric.tokensUsed,
      requestsMade: acc.requestsMade + metric.requestsMade,
      costAccrued: acc.costAccrued + metric.costAccrued,
    }),
    { tokensUsed: 0, requestsMade: 0, costAccrued: 0 }
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={dbUser.picture || ''} alt={dbUser.name || ''} />
                <AvatarFallback>
                  {dbUser.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{dbUser.name || 'No name set'}</h3>
                <p className="text-sm text-muted-foreground">{dbUser.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Subscription:</span>
                <Badge variant={dbUser.subscriptionStatus === 'ACTIVE' ? 'default' : 'secondary'}>
                  {dbUser.subscriptionTier}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Status:</span>
                <Badge variant={dbUser.subscriptionStatus === 'ACTIVE' ? 'default' : 'outline'}>
                  {dbUser.subscriptionStatus}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Terms Accepted:</span>
                <Badge variant={dbUser.termsAccepted ? 'default' : 'destructive'}>
                  {dbUser.termsAccepted ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extension Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle>VS Code Extension</CardTitle>
            <CardDescription>Connection status and management</CardDescription>
          </CardHeader>
          <CardContent>
            <ExtensionConnectionStatus 
              isConnected={isExtensionConnected}
              lastSync={dbUser.lastExtensionSync}
              activeSessions={dbUser.extensionSessions.length}
              termsAccepted={dbUser.termsAccepted}
            />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickStats usage={totalUsage} />
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Extension Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your VS Code extension preferences
            </p>
            <Button asChild className="w-full">
              <Link href="/profile/extension">Manage Extension</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Usage Analytics</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View detailed usage statistics and history
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile/usage">View Usage</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure your preferences and sync settings
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile/settings">Settings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Terms & Privacy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Review terms of service and privacy policy
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/terms">View Terms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
