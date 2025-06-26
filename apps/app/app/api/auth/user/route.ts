import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      const response = NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', 'https://cubent.dev');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      return response;
    }

    const user = await currentUser();

    if (!user) {
      const response = NextResponse.json({ error: 'User not found' }, { status: 404 });
      response.headers.set('Access-Control-Allow-Origin', 'https://cubent.dev');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      return response;
    }

    // Return user data in the format expected by the website
    const userData = {
      id: user.id,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses: user.emailAddresses.map(email => ({
        emailAddress: email.emailAddress
      })),
      imageUrl: user.imageUrl
    };

    const response = NextResponse.json(userData);
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', 'https://cubent.dev');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  } catch (error) {
    console.error('Error fetching user:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', 'https://cubent.dev');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://cubent.dev',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
