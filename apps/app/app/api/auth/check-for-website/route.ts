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
        (async function() {
            try {
                // Check if user is authenticated
                const response = await fetch('/api/auth/status', {
                    credentials: 'include'
                });
                
                const data = await response.json();
                
                // Send auth status to parent window
                window.parent.postMessage({
                    type: 'AUTH_STATUS',
                    authenticated: data.authenticated,
                    user: data.user || null
                }, 'https://cubent.vercel.app');
                
                // Also send to localhost for development
                window.parent.postMessage({
                    type: 'AUTH_STATUS',
                    authenticated: data.authenticated,
                    user: data.user || null
                }, 'http://localhost:3000');
                
            } catch (error) {
                console.error('Auth check error:', error);
                window.parent.postMessage({
                    type: 'AUTH_STATUS',
                    authenticated: false,
                    user: null
                }, '*');
            }
        })();
    </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'X-Frame-Options': 'ALLOWALL',
    },
  });
}
