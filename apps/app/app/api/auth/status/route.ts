import { auth, currentUser } from '@repo/auth/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'https://cubent.com',
      'https://www.cubent.com',
      'http://localhost:3000',
      'http://localhost:3001',
    ];

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? (origin || 'https://cubent.com') : 'https://cubent.com',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    };

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        authenticated: false
      }, {
        headers: corsHeaders
      });
    }

    const user = await currentUser();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user?.id,
        name: user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.firstName || user?.username || 'User',
        email: user?.emailAddresses?.[0]?.emailAddress || '',
        imageUrl: user?.imageUrl,
      }
    }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json({
      authenticated: false
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://cubent.com',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://cubent.com',
    'https://www.cubent.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? (origin || 'https://cubent.com') : 'https://cubent.com',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
