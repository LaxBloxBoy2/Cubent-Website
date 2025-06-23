import { auth, currentUser } from '@repo/auth/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        authenticated: false 
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Credentials': 'true',
        }
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json({ 
      authenticated: false 
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
