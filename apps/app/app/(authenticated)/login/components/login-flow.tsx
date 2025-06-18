'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { useState } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  termsAccepted: boolean;
};

type LoginFlowProps = {
  deviceId: string;
  state: string;
  user: User;
};

export const LoginFlow = ({ deviceId, state, user }: LoginFlowProps) => {
  const [termsAccepted, setTermsAccepted] = useState(user.termsAccepted);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleAcceptTerms = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the Terms of Use to continue');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/extension/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          state,
          acceptTerms: !user.termsAccepted,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to complete login');
      }

      const { token, redirectUrl } = await response.json();
      
      setIsComplete(true);
      toast.success('Login successful! You can now return to VS Code.');

      // Auto-redirect to VS Code if supported
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Login Successful!</CardTitle>
            <CardDescription>
              Your VS Code extension has been authorized successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You can now return to VS Code. The extension should automatically detect the authorization.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authorize VS Code Extension</CardTitle>
          <CardDescription>
            Welcome, {user.name || user.email}! Please review and accept our terms to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Terms of Use</h3>
            <div className="max-h-48 overflow-y-auto rounded border p-4 text-sm">
              <p className="mb-4">
                By using the Cubent VS Code extension, you agree to the following terms:
              </p>
              <ul className="list-disc space-y-2 pl-4">
                <li>You will use the extension in accordance with our usage policies</li>
                <li>You understand that AI-generated code should be reviewed before use</li>
                <li>You agree to our data collection and processing practices</li>
                <li>You will not use the extension for malicious or harmful purposes</li>
                <li>You acknowledge that the service is provided "as is"</li>
              </ul>
              <p className="mt-4 text-xs text-gray-500">
                For full terms, visit our website's Terms of Service page.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I accept the Terms of Use
            </label>
          </div>

          <Button
            onClick={handleAcceptTerms}
            disabled={!termsAccepted || isLoading}
            className="w-full"
          >
            {isLoading ? 'Authorizing...' : 'Authorize Extension'}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Device ID: {deviceId.slice(0, 8)}...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
