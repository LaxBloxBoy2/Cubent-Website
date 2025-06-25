'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Auth Success Handler
 * Handles redirects after successful authentication, particularly for extension flows
 */
export default function AuthSuccessPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectUrl = searchParams.get('redirect_url');
    
    if (redirectUrl) {
      // Validate the redirect URL to prevent open redirects
      try {
        const url = new URL(redirectUrl);
        
        // Only allow redirects to our own domain or extension callbacks
        const allowedHosts = [
          'localhost',
          'app.cubent.dev',
          'cubent.dev',
        ];
        
        const isExtensionCallback = url.protocol === 'vscode:';
        const isAllowedHost = allowedHosts.some(host => 
          url.hostname === host || url.hostname.endsWith(`.${host}`)
        );
        
        if (isExtensionCallback || isAllowedHost) {
          console.log('Redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
          return;
        }
      } catch (error) {
        console.error('Invalid redirect URL:', error);
      }
    }
    
    // Default redirect if no valid redirect_url
    window.location.href = '/profile';
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-4 text-sm text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
