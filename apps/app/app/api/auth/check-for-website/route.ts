import { auth, currentUser } from '@repo/auth/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Auth Check</title>
</head>
<body>
    <script>
        console.log('🚀 Auth check iframe loaded');

        (async function() {
            try {
                console.log('📡 Fetching auth status...');

                // Check if user is authenticated
                const response = await fetch('/api/auth/status', {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('📊 Auth response status:', response.status);

                const data = await response.json();
                console.log('📋 Auth data:', data);

                const authMessage = {
                    type: 'AUTH_STATUS',
                    authenticated: data.authenticated,
                    user: data.user || null
                };

                console.log('📤 Sending message to parent:', authMessage);

                // Send to production website
                window.parent.postMessage(authMessage, 'https://cubent.vercel.app');

                // Send to development
                window.parent.postMessage(authMessage, 'http://localhost:3000');

                // Send to any origin as fallback
                window.parent.postMessage(authMessage, '*');

                console.log('✅ Messages sent successfully');

            } catch (error) {
                console.error('❌ Auth check error:', error);

                const errorMessage = {
                    type: 'AUTH_STATUS',
                    authenticated: false,
                    user: null,
                    error: error.message
                };

                window.parent.postMessage(errorMessage, '*');
            }
        })();
    </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self' https://cubent.vercel.app http://localhost:3000;",
    },
  });
}
