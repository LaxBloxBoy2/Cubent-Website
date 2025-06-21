'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { useState } from 'react';

/**
 * Debug Authentication Flow Page
 * Helps test and debug the extension authentication flows
 */
export default function DebugAuthPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearLogs = () => setLogs([]);

  const testDeviceOAuthFlow = () => {
    addLog('Testing Device OAuth Flow...');
    const deviceId = 'test-device-' + Math.random().toString(36).substr(2, 9);
    const state = 'test-state-' + Math.random().toString(36).substr(2, 9);
    const url = `/sign-in?device_id=${deviceId}&state=${state}`;
    
    addLog(`Generated URL: ${url}`);
    addLog('Opening in new tab...');
    
    window.open(url, '_blank');
  };

  const testLegacyFlow = () => {
    addLog('Testing Legacy Flow...');
    const state = 'test-state-' + Math.random().toString(36).substr(2, 9);
    const authRedirect = 'vscode://cubent.cubent/auth';
    const url = `/api/extension/sign-in?state=${state}&auth_redirect=${encodeURIComponent(authRedirect)}`;

    addLog(`Generated URL: ${url}`);
    addLog('Opening in new tab...');

    window.open(url, '_blank');
  };

  const testDirectLogin = () => {
    addLog('Testing Direct Login Page...');
    const deviceId = 'test-device-' + Math.random().toString(36).substr(2, 9);
    const state = 'test-state-' + Math.random().toString(36).substr(2, 9);
    const url = `/login?device_id=${deviceId}&state=${state}`;
    
    addLog(`Generated URL: ${url}`);
    addLog('Opening in new tab...');
    
    window.open(url, '_blank');
  };

  const testAuthSuccess = () => {
    addLog('Testing Auth Success Page...');
    const redirectUrl = 'vscode://cubent.cubent/auth/callback?token=test-token&state=test-state';
    const url = `/auth-success?redirect_url=${encodeURIComponent(redirectUrl)}`;

    addLog(`Generated URL: ${url}`);
    addLog('Opening in new tab...');

    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Authentication Flow Debugger</h1>
        <p className="text-muted-foreground mt-2">
          Test and debug extension authentication flows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device OAuth Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tests the primary authentication flow used by the "Connect to Cubent Cloud" button.
            </p>
            <Button onClick={testDeviceOAuthFlow} className="w-full">
              Test Device OAuth
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legacy Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tests the legacy authentication flow used by the "Sign In (Legacy)" button.
            </p>
            <Button onClick={testLegacyFlow} className="w-full">
              Test Legacy Flow
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Direct Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tests direct access to the login page with device parameters.
            </p>
            <Button onClick={testDirectLogin} className="w-full">
              Test Direct Login
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auth Success</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tests the auth success page redirect functionality.
            </p>
            <Button onClick={testAuthSuccess} className="w-full">
              Test Auth Success
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Debug Logs</CardTitle>
          <Button variant="outline" size="sm" onClick={clearLogs}>
            Clear Logs
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No logs yet. Click a test button to start.</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Current URL:</strong>
              <br />
              <code className="text-xs">{typeof window !== 'undefined' ? window.location.href : 'N/A'}</code>
            </div>
            <div>
              <strong>User Agent:</strong>
              <br />
              <code className="text-xs">{typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 50) + '...' : 'N/A'}</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
