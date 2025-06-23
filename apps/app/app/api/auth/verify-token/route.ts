import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://cubent.vercel.app',
    'http://localhost:3000',
  ];

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? (origin || 'https://cubent.vercel.app') : 'https://cubent.vercel.app',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  };

  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        error: 'No token provided'
      }, { headers: corsHeaders });
    }

    const { payload } = await jwtVerify(token, secret);
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
        imageUrl: payload.imageUrl,
      }
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: 'Invalid or expired token'
    }, { 
      status: 401,
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
