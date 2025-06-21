import { auth, clerkClient } from '@repo/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const signInSchema = z.object({
  state: z.string().min(1),
  auth_redirect: z.string().url(),
});

/**
 * Extension sign-in endpoint
 * Handles authentication initiation for VS Code extension
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const authRedirect = searchParams.get('auth_redirect');

    // Validate parameters
    const validation = signInSchema.safeParse({
      state,
      auth_redirect: authRedirect,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { state: validatedState, auth_redirect: validatedAuthRedirect } = validation.data;

    // Check if user is already authenticated
    const { userId } = await auth();
    
    if (userId) {
      // User is already authenticated, create a ticket for the extension
      const client = await clerkClient();
      const ticket = await client.signInTokens.createSignInToken({
        userId,
        expiresInSeconds: 300, // 5 minutes
      });

      // Redirect to extension with the ticket
      const redirectUrl = new URL(validatedAuthRedirect);
      redirectUrl.searchParams.set('ticket', ticket.token);
      redirectUrl.searchParams.set('state', validatedState);

      return NextResponse.redirect(redirectUrl.toString());
    }

    // User is not authenticated, redirect to sign-in with return URL
    // Store the original request URL in session/cookie for after-login redirect
    const signInUrl = new URL('/sign-in', request.url);

    // Use Clerk's redirect_url parameter (this gets handled by Clerk after sign-in)
    const afterSignInUrl = new URL('/api/extension/sign-in', request.url);
    afterSignInUrl.searchParams.set('state', validatedState);
    afterSignInUrl.searchParams.set('auth_redirect', validatedAuthRedirect);

    signInUrl.searchParams.set('redirect_url', afterSignInUrl.toString());

    return NextResponse.redirect(signInUrl.toString());
  } catch (error) {
    console.error('Extension sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
