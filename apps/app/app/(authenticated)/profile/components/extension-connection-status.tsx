'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Badge } from '@repo/design-system/components/ui/badge';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RefreshCwIcon, ExternalLinkIcon, AlertCircleIcon } from 'lucide-react';

interface ExtensionConnectionStatusProps {
  isConnected: boolean;
  lastSync: Date | null;
  activeSessions: number;
  termsAccepted: boolean;
}

interface ExtensionStatus {
  connected: boolean;
  lastActive: string | null;
  activeSessions: number;
  health: 'healthy' | 'disconnected' | 'warning';
  sessions: Array<{
    id: string;
    sessionId: string;
    extensionVersion?: string;
    vscodeVersion?: string;
    platform?: string;
    lastActiveAt: string;
  }>;
}

export function ExtensionConnectionStatus({
  isConnected,
  lastSync,
  activeSessions,
  termsAccepted,
}: ExtensionConnectionStatusProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch extension status
  const fetchExtensionStatus = async () => {
    try {
      const response = await fetch('/api/extension/status');
      if (response.ok) {
        const data = await response.json();
        setExtensionStatus(data.status);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch extension status:', error);
    }
  };

  // Auto-refresh status every 30 seconds
  useEffect(() => {
    fetchExtensionStatus();
    const interval = setInterval(fetchExtensionStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    await fetchExtensionStatus();
    setIsRefreshing(false);
    toast.success('Status refreshed');
  };

  const handleConnectExtension = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the terms of service first');
      window.location.href = '/terms';
      return;
    }

    setIsConnecting(true);
    try {
      // Trigger VS Code extension connection
      const vscodeUrl = `vscode://cubent.cubent/connect?website=${encodeURIComponent(window.location.origin)}`;
      window.open(vscodeUrl, '_blank');
      
      toast.success('Opening VS Code extension...');
      
      // Check connection status after a delay
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.error('Failed to connect extension');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectExtension = async () => {
    try {
      const response = await fetch('/api/extension/sessions?all=true', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('All extension sessions terminated');
        await fetchExtensionStatus();
      } else {
        toast.error('Failed to disconnect extension');
      }
    } catch (error) {
      toast.error('Failed to disconnect extension');
    }
  };

  const handleTestButton = async () => {
    try {
      setIsConnecting(true);

      // Test the extension status endpoint
      const response = await fetch('/api/extension/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: `test_${Date.now()}`,
          extensionVersion: 'test-button',
          vscodeVersion: 'webapp',
          platform: 'browser'
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Test session created successfully!');
        await fetchExtensionStatus();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(`Test failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Test button failed');
      console.error('Test error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const currentStatus = extensionStatus || {
    connected: isConnected,
    lastActive: lastSync?.toISOString() || null,
    activeSessions,
    health: isConnected ? 'healthy' : 'disconnected',
    sessions: [],
  };

  const getStatusColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'default';
      case 'warning': return 'secondary';
      case 'disconnected': return 'outline';
      default: return 'outline';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'warning': return <AlertCircleIcon className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={getStatusColor(currentStatus.health)} className="flex items-center gap-1">
            {getHealthIcon(currentStatus.health)}
            {currentStatus.connected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefreshStatus}
          disabled={isRefreshing}
          className="h-6 w-6 p-0"
        >
          <RefreshCwIcon className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Connection Details */}
      {currentStatus.connected && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Sessions:</span>
            <span className="text-sm font-mono">{currentStatus.activeSessions}</span>
          </div>

          {currentStatus.lastActive && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Active:</span>
              <span className="text-sm">
                {new Date(currentStatus.lastActive).toLocaleString()}
              </span>
            </div>
          )}

          {/* Session Details */}
          {currentStatus.sessions.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Recent Sessions:</span>
              <div className="space-y-1">
                {currentStatus.sessions.slice(0, 2).map((session) => (
                  <div key={session.id} className="text-xs bg-muted p-2 rounded">
                    <div className="flex justify-between">
                      <span>VS Code {session.vscodeVersion}</span>
                      <span>{session.platform}</span>
                    </div>
                    {session.extensionVersion && (
                      <div className="text-muted-foreground">
                        Extension v{session.extensionVersion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Last Refresh Time */}
      <div className="text-xs text-muted-foreground">
        Last updated: {lastRefresh.toLocaleTimeString()}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        {currentStatus.connected ? (
          <div className="space-y-2">
            <Button
              onClick={handleDisconnectExtension}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              Disconnect All Sessions
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full"
            >
              <a href="/profile/extension" className="flex items-center gap-2">
                <ExternalLinkIcon className="h-3 w-3" />
                Manage Extension
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={handleConnectExtension}
              disabled={isConnecting || !termsAccepted}
              size="sm"
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : 'Connect Extension'}
            </Button>
            <Button
              onClick={handleTestButton}
              disabled={isConnecting}
              variant="outline"
              size="sm"
              className="w-full"
            >
              🧪 Test Connection
            </Button>
          </div>
        )}
      </div>

      {/* Terms Warning */}
      {!termsAccepted && (
        <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
          <AlertCircleIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Terms Required</p>
            <p className="text-yellow-700 dark:text-yellow-300">
              You must accept the terms of service before connecting the extension.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
