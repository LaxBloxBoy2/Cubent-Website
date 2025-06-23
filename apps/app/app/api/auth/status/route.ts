import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Cross-domain authentication status endpoint
 * Returns user authentication status in JSONP format for cross-domain access
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callback = searchParams.get('callback');
  
  try {
    const { userId } = await auth();
    
    let responseData: {
      authenticated: boolean;
      user: {
        id: string;
        name: string;
        email: string;
        picture: string | null;
        subscriptionTier: string | null;
      } | null;
      timestamp: number;
    } = {
      authenticated: false,
      user: null,
      timestamp: Date.now(),
    };

    if (userId) {
      // Get user from database
      const dbUser = await database.user.findUnique({
        where: { clerkId: userId },
        select: {
          id: true,
          name: true,
          email: true,
          picture: true,
          subscriptionTier: true,
          subscriptionStatus: true,
        },
      });

      if (dbUser) {
        responseData = {
          authenticated: true,
          user: {
            id: dbUser.id,
            name: dbUser.name || 'User',
            email: dbUser.email,
            picture: dbUser.picture,
            subscriptionTier: dbUser.subscriptionTier,
          },
          timestamp: Date.now(),
        };
      }
    }

    // Get the origin from the request
    const origin = request.headers.get('origin') || 'https://cubent.vercel.app';
    const allowedOrigins = ['https://cubent.vercel.app', 'https://www.cubent.vercel.app', 'http://localhost:3001'];
    const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://cubent.vercel.app';

    // If callback is provided, return JSONP response
    if (callback) {
      const response = `${callback}(${JSON.stringify(responseData)});`;

      return new NextResponse(response, {
        headers: {
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    // Otherwise return regular JSON response
    return NextResponse.json(responseData, {
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Auth status check failed:', error);

    const origin = request.headers.get('origin') || 'https://cubent.vercel.app';
    const allowedOrigins = ['https://cubent.vercel.app', 'https://www.cubent.vercel.app', 'http://localhost:3001'];
    const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://cubent.vercel.app';

    const errorResponse = {
      authenticated: false,
      user: null,
      timestamp: Date.now(),
    };

    if (callback) {
      const response = `${callback}(${JSON.stringify(errorResponse)});`;

      return new NextResponse(response, {
        headers: {
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Credentials': 'true',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    return NextResponse.json(errorResponse, {
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || 'https://cubent.vercel.app';
  const allowedOrigins = ['https://cubent.vercel.app', 'https://www.cubent.vercel.app', 'http://localhost:3001'];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://cubent.vercel.app';

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
