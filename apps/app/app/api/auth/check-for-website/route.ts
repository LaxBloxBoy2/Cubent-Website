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
                console.log('📡 Generating auth token...');

                // Get auth token from the app (this will work since we're in the app domain)
                const response = await fetch('/api/auth/website-token', {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('📊 Token response status:', response.status);

                const data = await response.json();
                console.log('📋 Token data:', data);

                const authMessage = {
                    type: 'AUTH_TOKEN',
                    success: data.success,
                    token: data.token || null,
                    error: data.error || null
                };

                console.log('📤 Sending token to parent:', authMessage);

                // Send to production website
                window.parent.postMessage(authMessage, 'https://cubent.vercel.app');

                // Send to development
                window.parent.postMessage(authMessage, 'http://localhost:3000');

                console.log('✅ Token sent successfully');

            } catch (error) {
                console.error('❌ Token generation error:', error);

                const errorMessage = {
                    type: 'AUTH_TOKEN',
                    success: false,
                    token: null,
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
