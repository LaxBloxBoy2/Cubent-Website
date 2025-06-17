import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SettingsForm } from './components/settings-form';

const title = 'Settings';
const description = 'Manage your preferences and extension settings.';

export const metadata: Metadata = createMetadata({ title, description });

const SettingsPage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  const dbUser = await database.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Extension Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Extension Settings</CardTitle>
            <CardDescription>
              Configure settings that sync with your VS Code extension
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm 
              userId={dbUser.id}
              extensionSettings={dbUser.extensionSettings as Record<string, any> || {}}
              preferences={dbUser.preferences as Record<string, any> || {}}
            />
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="text-sm text-muted-foreground">{dbUser.email}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <div className="text-sm text-muted-foreground">
                {dbUser.name || 'Not set'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subscription</label>
              <div className="text-sm text-muted-foreground">
                {dbUser.subscriptionTier} ({dbUser.subscriptionStatus})
              </div>
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Information */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Information</CardTitle>
          <CardDescription>
            How settings synchronization works between the website and extension
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Extension Settings</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI model preferences</li>
                <li>• API key configurations</li>
                <li>• Extension behavior settings</li>
                <li>• Custom prompts and templates</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">User Preferences</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Theme and appearance</li>
                <li>• Notification settings</li>
                <li>• Privacy preferences</li>
                <li>• Usage analytics options</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Sync Status</h4>
            <div className="text-sm text-muted-foreground">
              {dbUser.lastExtensionSync ? (
                <p>
                  Last synced: {new Date(dbUser.lastExtensionSync).toLocaleString()}
                </p>
              ) : (
                <p>Extension not connected - settings will sync when connected</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your account and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
            <div>
              <h4 className="font-semibold">Reset Extension Settings</h4>
              <p className="text-sm text-muted-foreground">
                Clear all extension settings and preferences
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Reset Settings
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
            <div>
              <h4 className="font-semibold">Disconnect All Sessions</h4>
              <p className="text-sm text-muted-foreground">
                Force disconnect all active extension sessions
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Disconnect All
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
            <div>
              <h4 className="font-semibold">Delete Account Data</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete all usage data and settings
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
