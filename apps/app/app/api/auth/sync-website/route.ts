import { auth, currentUser } from '@repo/auth/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      // Redirect to website without auth data
      return NextResponse.redirect('https://cubent.com');
    }

    const user = await currentUser();
    
    const userData = {
      id: user?.id,
      name: user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user?.firstName || user?.username || 'User',
      email: user?.emailAddresses?.[0]?.emailAddress || '',
      imageUrl: user?.imageUrl,
    };

    // Encode user data and redirect to website
    const authData = encodeURIComponent(JSON.stringify(userData));
    const websiteUrl = `https://cubent.com?auth=${authData}`;
    
    return NextResponse.redirect(websiteUrl);
  } catch (error) {
    console.error('Website sync error:', error);
    return NextResponse.redirect('https://cubent.com');
  }
}
