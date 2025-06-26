import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the cross-domain auth token
    const cookieStore = await cookies();
    cookieStore.set('cubent_auth_token', '', {
      domain: '.cubent.dev',
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing cross-domain token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
