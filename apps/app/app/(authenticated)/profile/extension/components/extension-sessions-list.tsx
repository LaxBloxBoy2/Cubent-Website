'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Separator } from '@repo/design-system/components/ui/separator';
import { useState } from 'react';
import { toast } from 'sonner';
import { Unplug, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ExtensionSession {
  id: string;
  sessionId: string;
  isActive: boolean;
  lastSeen: Date;
  createdAt: Date;
}

interface ExtensionSessionsListProps {
  activeSessions: ExtensionSession[];
  inactiveSessions: ExtensionSession[];
}

export function ExtensionSessionsList({ 
  activeSessions, 
  inactiveSessions 
}: ExtensionSessionsListProps) {
  const [disconnectingSession, setDisconnectingSession] = useState<string | null>(null);

  const handleDisconnectSession = async (sessionId: string) => {
    setDisconnectingSession(sessionId);
    try {
      const response = await fetch(`/api/extension/connect?sessionId=${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Session disconnected successfully');
        window.location.reload();
      } else {
        toast.error('Failed to disconnect session');
      }
    } catch (error) {
      toast.error('Failed to disconnect session');
    } finally {
      setDisconnectingSession(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (activeSessions.length === 0 && inactiveSessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No extension sessions found.</p>
        <p className="text-sm">Connect your VS Code extension to see sessions here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <h3 className="font-semibold">Active Sessions ({activeSessions.length})</h3>
          </div>
          
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Active</Badge>
                    <span className="font-mono text-sm">
                      {session.sessionId.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>Connected: {formatDate(session.createdAt)}</span>
                      <span>Last seen: {formatRelativeTime(session.lastSeen)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnectSession(session.sessionId)}
                  disabled={disconnectingSession === session.sessionId}
                >
                  <Unplug className="h-4 w-4 mr-2" />
                  {disconnectingSession === session.sessionId ? 'Disconnecting...' : 'Disconnect'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Separator */}
      {activeSessions.length > 0 && inactiveSessions.length > 0 && (
        <Separator />
      )}

      {/* Inactive Sessions */}
      {inactiveSessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-gray-500" />
            <h3 className="font-semibold">Past Sessions ({inactiveSessions.length})</h3>
          </div>
          
          <div className="space-y-3">
            {inactiveSessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 border rounded-lg opacity-60"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Inactive</Badge>
                    <span className="font-mono text-sm">
                      {session.sessionId.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>Connected: {formatDate(session.createdAt)}</span>
                      <span>Last seen: {formatDate(session.lastSeen)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Disconnected</span>
                </div>
              </div>
            ))}
            
            {inactiveSessions.length > 5 && (
              <p className="text-sm text-muted-foreground text-center">
                ... and {inactiveSessions.length - 5} more past sessions
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
