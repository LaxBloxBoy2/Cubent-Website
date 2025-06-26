'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function AuthCheckPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded) {
      const authData = {
        type: 'AUTH_STATUS',
        isAuthenticated: isSignedIn,
        user: isSignedIn && user ? {
          id: user.id,
          fullName: user.fullName,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddresses: user.emailAddresses.map(email => ({
            emailAddress: email.emailAddress
          })),
          imageUrl: user.imageUrl
        } : null
      };

      // Send auth status to parent window (cubent.dev)
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(authData, 'https://cubent.dev');
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <div style={{ display: 'none' }}>
      Checking authentication status...
    </div>
  );
}
