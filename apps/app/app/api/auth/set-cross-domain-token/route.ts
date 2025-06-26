import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create a simple token with user data
    const tokenData = {
      id: user.id,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses: user.emailAddresses.map(email => ({
        emailAddress: email.emailAddress
      })),
      imageUrl: user.imageUrl,
      timestamp: Date.now()
    };

    // Encode the token (in production, you'd want to encrypt/sign this)
    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

    // Set cookie with domain .cubent.dev so it's shared across subdomains
    const cookieStore = await cookies();
    cookieStore.set('cubent_auth_token', token, {
      domain: '.cubent.dev',
      httpOnly: false, // Allow JavaScript access
      secure: true, // HTTPS only
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error('Error setting cross-domain token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
