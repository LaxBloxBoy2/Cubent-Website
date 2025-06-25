import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the session token from the request cookies
    const sessionToken = request.cookies.get('__session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ isAuthenticated: false });
    }

    // Make a request to app.cubent.dev to verify the session
    const response = await fetch('https://app.cubent.dev/api/auth/verify', {
      headers: {
        'Cookie': `__session=${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return NextResponse.json({ 
        isAuthenticated: true, 
        user: userData 
      });
    } else {
      return NextResponse.json({ isAuthenticated: false });
    }
  } catch (error) {
    console.error('Auth status check failed:', error);
    return NextResponse.json({ isAuthenticated: false });
  }
}
