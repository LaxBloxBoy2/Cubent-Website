import { auth, currentUser } from '@repo/auth/server';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Not authenticated'
      });
    }

    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found'
      });
    }

    // Create a temporary token valid for 5 minutes
    const token = await new SignJWT({
      userId: user.id,
      name: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.firstName || user.username || 'User',
      email: user.emailAddresses?.[0]?.emailAddress || '',
      imageUrl: user.imageUrl,
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(secret);

    return NextResponse.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Website token generation error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
