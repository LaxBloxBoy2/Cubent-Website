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
    
    let responseData = {
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

    // If callback is provided, return JSONP response
    if (callback) {
      const response = `${callback}(${JSON.stringify(responseData)});`;
      
      return new NextResponse(response, {
        headers: {
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    // Otherwise return regular JSON response
    return NextResponse.json(responseData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Auth status check failed:', error);
    
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
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    return NextResponse.json(errorResponse, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}
