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
      // Create a hidden iframe to check auth status from app.cubent.dev
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'https://app.cubent.dev/auth-check';

      // Listen for messages from the iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== 'https://app.cubent.dev') return;

        if (event.data.type === 'AUTH_STATUS') {
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

      // Timeout after 5 seconds
      timeoutId = setTimeout(() => {
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
