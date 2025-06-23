import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Cross-domain authentication check endpoint
 * 
 * This endpoint allows the website (cubent.vercel.app) to check if a user
 * is authenticated on the app domain (app-cubent.vercel.app) and get their
 * basic profile information.
 * 
 * CORS is enabled to allow cross-domain requests from the website.
 */

// CORS headers for cross-domain requests
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_WEB_URL || 'https://cubent.vercel.app',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    // Add CORS headers to the response
    const headers = new Headers(corsHeaders);

    // Check if user is authenticated
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { 
          isAuthenticated: false,
          user: null 
        },
        { 
          status: 200,
          headers 
        }
      );
    }

    // Get user from database for additional info
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        createdAt: true,
      },
    });

    // Return user information
    const userInfo = {
      id: user.id,
      name: dbUser?.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
      email: user.emailAddresses[0]?.emailAddress || dbUser?.email || null,
      picture: user.imageUrl || dbUser?.picture || null,
      subscriptionTier: dbUser?.subscriptionTier || 'free',
      subscriptionStatus: dbUser?.subscriptionStatus || 'active',
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return NextResponse.json(
      {
        isAuthenticated: true,
        user: userInfo,
      },
      {
        status: 200,
        headers,
      }
    );

  } catch (error) {
    console.error('Cross-domain auth check error:', error);
    
    return NextResponse.json(
      { 
        isAuthenticated: false,
        user: null,
        error: 'Internal server error' 
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
