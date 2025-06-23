import { auth, currentUser } from '@repo/auth/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        authenticated: false 
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
    });
  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json({ 
      authenticated: false 
    }, { status: 500 });
  }
}
