/**
 * VSCode Extension Login API Endpoint
 *
 * Handles the secure token generation for VSCode extension authentication.
 * This endpoint is called after the user accepts Terms of Use on the login page.
 *
 * Security measures:
 * - User authentication validation via Clerk
 * - Terms of Use acceptance enforcement
 * - Short-lived JWT token generation (10 minutes)
 * - Automatic cleanup of existing tokens for device
 * - Comprehensive audit logging
 *
 * Returns:
 * - Secure session token for extension authentication
 * - VS Code deep link for seamless callback
 * - Success confirmation with timestamp
 */

import { auth, clerkClient, currentUser } from '@repo/auth/server';
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
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { deviceId, state, acceptTerms } = loginSchema.parse(body);

    // Find or create user in database using upsert to handle duplicates
    let user = await database.user.upsert({
      where: { clerkId: userId },
      update: {
        // Update existing user with latest info from Clerk
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
        picture: clerkUser.imageUrl,
      },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
        picture: clerkUser.imageUrl,
      },
    });

    // Update terms acceptance if needed
    if (acceptTerms && !user.termsAccepted) {
      user = await database.user.update({
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

    // Generate a secure random token for the extension
    const { randomBytes } = await import('crypto');
    const authToken = `cubent_ext_${randomBytes(32).toString('hex')}`;

    // Set expiration time (10 minutes from now)
    // Note: Clerk session expiration is handled by Clerk, but we enforce our own expiration
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
        userId,
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
    const redirectUrl = `vscode://cubent.cubent/auth/callback?token=${encodeURIComponent(authToken)}&state=${encodeURIComponent(state)}`;

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
