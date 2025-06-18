import { auth, clerkClient } from '@repo/auth/server';
import { database } from '@repo/database';
import { parseError } from '@repo/observability/error';
import { log } from '@repo/observability/log';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  state: z.string().min(1, 'State parameter is required'),
  acceptTerms: z.boolean().optional(),
});

export const POST = async (request: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { deviceId, state, acceptTerms } = loginSchema.parse(body);

    // Get user from database
    const user = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User not found in database' },
        { status: 404 }
      );
    }

    // Update terms acceptance if needed
    if (acceptTerms && !user.termsAccepted) {
      await database.user.update({
        where: { id: user.id },
        data: {
          termsAccepted: true,
          termsAcceptedAt: new Date(),
        },
      });
    }

    // Check if user has accepted terms
    const userTermsAccepted = user.termsAccepted || acceptTerms;
    if (!userTermsAccepted) {
      return NextResponse.json(
        { error: 'Terms not accepted', message: 'User must accept terms to continue' },
        { status: 400 }
      );
    }

    // Generate a short-lived JWT token using Clerk
    const clerk = await clerkClient();
    const token = await clerk.users.getUserOauthAccessToken(userId, 'oauth_google');

    // If we can't get an OAuth token, create a session token instead
    let authToken: string;
    if (token && token.length > 0 && token[0]?.token) {
      authToken = token[0].token;
    } else {
      // Create a session token as fallback
      const sessionToken = await clerk.sessions.createSessionToken({
        userId,
        expiresInSeconds: 600, // 10 minutes
      });
      authToken = sessionToken;
    }

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Clean up any existing pending logins for this device
    await database.pendingLogin.deleteMany({
      where: {
        OR: [
          { deviceId },
          { expiresAt: { lt: new Date() } }, // Also clean up expired entries
        ],
      },
    });

    // Save the pending login
    await database.pendingLogin.create({
      data: {
        deviceId,
        state,
        token: authToken,
        expiresAt,
      },
    });

    // Log the successful login
    log.info('Extension login successful', {
      userId: user.id,
      deviceId: deviceId.slice(0, 8) + '...',
      email: user.email,
    });

    // Generate VS Code callback URL
    const redirectUrl = `vscode://cubent.auth/callback?token=${encodeURIComponent(authToken)}&state=${encodeURIComponent(state)}`;

    return NextResponse.json({
      success: true,
      token: authToken,
      redirectUrl,
      message: 'Login successful',
    });
  } catch (error) {
    const message = parseError(error);
    log.error('Extension login failed', { error: message });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', message: error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: 'Login failed' },
      { status: 500 }
    );
  }
};
