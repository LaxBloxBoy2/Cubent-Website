'use client';

import { useState, useEffect } from 'react';

type AuthUser = {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  imageUrl: string;
};

type AuthStatus = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
};

export function useAuthStatus(): AuthStatus {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function checkAuthStatus() {
      console.log('[AUTH] Starting auth check...');

      // Create a hidden iframe to check auth status from app.cubent.dev
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'https://app.cubent.dev/auth-check';

      // Listen for messages from the iframe
      const handleMessage = (event: MessageEvent) => {
        console.log('[AUTH] Received message:', event.origin, event.data);

        if (event.origin !== 'https://app.cubent.dev') {
          console.log('[AUTH] Ignoring message from wrong origin:', event.origin);
          return;
        }

        if (event.data.type === 'AUTH_STATUS') {
          console.log('[AUTH] Setting auth status:', event.data);
          setAuthStatus({
            isAuthenticated: event.data.isAuthenticated,
            user: event.data.user || null,
            isLoading: false,
          });

          // Clean up
          document.body.removeChild(iframe);
          window.removeEventListener('message', handleMessage);
          clearTimeout(timeoutId);
        }
      };

      window.addEventListener('message', handleMessage);
      document.body.appendChild(iframe);
      console.log('[AUTH] Iframe created and added to DOM');

      // Timeout after 5 seconds
      timeoutId = setTimeout(() => {
        console.log('[AUTH] Timeout reached, setting not authenticated');
        setAuthStatus({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });

        // Clean up
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        window.removeEventListener('message', handleMessage);
      }, 5000);
    }

    checkAuthStatus();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return authStatus;
}
