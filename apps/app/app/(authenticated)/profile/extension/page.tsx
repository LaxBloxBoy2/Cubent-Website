import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, RefreshCw, Unplug } from 'lucide-react';
import { ExtensionSessionsList } from './components/extension-sessions-list';
import { ApiKeyManager } from './components/api-key-manager';

const title = 'Extension Management';
const description = 'Manage your VS Code extension connection and settings.';

export const metadata: Metadata = createMetadata({ title, description });

const ExtensionPage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  const dbUser = await database.user.findUnique({
    where: { clerkId: userId },
    include: {
      extensionSessions: {
        orderBy: { lastSeen: 'desc' },
      },
    },
  });

  if (!dbUser) {
    notFound();
  }

  const activeSessions = dbUser.extensionSessions.filter(session => session.isActive);
  const inactiveSessions = dbUser.extensionSessions.filter(session => !session.isActive);

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
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>
              Current status of your VS Code extension connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Extension Status:</span>
              <Badge variant={activeSessions.length > 0 ? 'default' : 'secondary'}>
                {activeSessions.length > 0 ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Active Sessions:</span>
              <span>{activeSessions.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Terms Accepted:</span>
              <Badge variant={dbUser.termsAccepted ? 'default' : 'destructive'}>
                {dbUser.termsAccepted ? 'Yes' : 'No'}
              </Badge>
            </div>

            {dbUser.lastExtensionSync && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Last Sync:</span>
                <span className="text-sm">
                  {new Date(dbUser.lastExtensionSync).toLocaleString()}
                </span>
              </div>
            )}

            <div className="pt-4 space-y-2">
              {!dbUser.termsAccepted ? (
                <Button asChild className="w-full">
                  <Link href="/terms">Accept Terms to Connect</Link>
                </Button>
              ) : activeSessions.length === 0 ? (
                <Button className="w-full">
                  Connect Extension
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Connection
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <Unplug className="h-4 w-4 mr-2" />
                    Disconnect All Sessions
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Key Management */}
        <Card>
          <CardHeader>
            <CardTitle>API Key</CardTitle>
            <CardDescription>
              Manage your extension API key for secure communication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiKeyManager 
              apiKey={dbUser.extensionApiKey}
              userId={dbUser.id}
            />
          </CardContent>
        </Card>
      </div>

      {/* Extension Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Extension Sessions</CardTitle>
          <CardDescription>
            View and manage your active and past extension sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExtensionSessionsList 
            activeSessions={activeSessions}
            inactiveSessions={inactiveSessions}
          />
        </CardContent>
      </Card>

      {/* Connection Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Instructions</CardTitle>
          <CardDescription>
            How to connect your VS Code extension to this website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Automatic Connection (Recommended)</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Make sure you have accepted the terms of service on this website</li>
              <li>Click the "Connect Extension" button above</li>
              <li>VS Code will open automatically and prompt you to connect</li>
              <li>Follow the prompts in VS Code to complete the connection</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Manual Connection</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Open VS Code with the Cubent extension installed</li>
              <li>Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)</li>
              <li>Run the command "Cubent: Connect to Website"</li>
              <li>Enter this website URL when prompted</li>
              <li>Complete the authentication flow</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Troubleshooting</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Make sure you're signed in to the same account in both VS Code and this website</li>
              <li>Check that the Cubent extension is installed and up to date</li>
              <li>Try refreshing the connection if it appears stuck</li>
              <li>Contact support if you continue to experience issues</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtensionPage;
