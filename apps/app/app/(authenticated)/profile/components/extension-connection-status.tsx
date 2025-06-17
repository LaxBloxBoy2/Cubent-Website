'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Badge } from '@repo/design-system/components/ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';

interface ExtensionConnectionStatusProps {
  isConnected: boolean;
  lastSync: Date | null;
  activeSessions: number;
  termsAccepted: boolean;
}

export function ExtensionConnectionStatus({
  isConnected,
  lastSync,
  activeSessions,
  termsAccepted,
}: ExtensionConnectionStatusProps) {
  const [isConnecting, setIsConnecting] = useState(false);

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
      const response = await fetch('/api/extension/connect', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Extension disconnected successfully');
        window.location.reload();
      } else {
        toast.error('Failed to disconnect extension');
      }
    } catch (error) {
      toast.error('Failed to disconnect extension');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Status:</span>
        <Badge variant={isConnected ? 'default' : 'secondary'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      {isConnected && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Sessions:</span>
            <span className="text-sm">{activeSessions}</span>
          </div>

          {lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Sync:</span>
              <span className="text-sm">
                {new Date(lastSync).toLocaleDateString()}
              </span>
            </div>
          )}
        </>
      )}

      <div className="pt-2">
        {isConnected ? (
          <Button 
            onClick={handleDisconnectExtension}
            variant="destructive" 
            size="sm" 
            className="w-full"
          >
            Disconnect Extension
          </Button>
        ) : (
          <Button 
            onClick={handleConnectExtension}
            disabled={isConnecting || !termsAccepted}
            size="sm" 
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect Extension'}
          </Button>
        )}
      </div>

      {!termsAccepted && (
        <p className="text-xs text-muted-foreground">
          You must accept the terms of service before connecting the extension.
        </p>
      )}
    </div>
  );
}
