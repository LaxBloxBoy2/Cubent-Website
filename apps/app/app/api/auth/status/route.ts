import { auth, currentUser } from '@repo/auth/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  console.log('🌐 Auth status request from origin:', origin);

  const allowedOrigins = [
    'https://cubent.vercel.app',
    'http://localhost:3000',
  ];

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? (origin || 'https://cubent.vercel.app') : 'https://cubent.vercel.app',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };

  console.log('🔧 CORS headers:', corsHeaders);

  try {
    console.log('🔐 Checking auth...');
    const { userId } = await auth();
    console.log('👤 User ID from auth():', userId);

    if (!userId) {
      console.log('❌ No user ID found');
      return NextResponse.json({
        authenticated: false
      }, {
        headers: corsHeaders
      });
    }

    console.log('✅ User ID found, getting user details...');
    const user = await currentUser();
    console.log('👤 Current user:', user?.id, user?.firstName, user?.lastName);

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
      headers: corsHeaders
    });
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://cubent.vercel.app',
    'http://localhost:3000',
  ];

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? (origin || 'https://cubent.vercel.app') : 'https://cubent.vercel.app',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
