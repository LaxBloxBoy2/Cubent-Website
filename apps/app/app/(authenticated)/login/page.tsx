/**
 * VSCode Extension Login Page
 *
 * This page handles the secure authentication flow for the Cubent VSCode extension.
 * It accepts device_id and state parameters, validates user authentication,
 * and guides users through Terms of Use acceptance before generating secure tokens.
 *
 * Security features:
 * - CSRF protection via state parameter validation
 * - Short-lived token generation (10 minutes)
 * - One-time use tokens with automatic cleanup
 * - Comprehensive logging and error handling
 *
 * Flow:
 * 1. Validate device_id and state parameters
 * 2. Redirect to Clerk sign-in if not authenticated
 * 3. Show Terms of Use acceptance interface
 * 4. Generate secure token and redirect to VS Code
 */

import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { redirect } from 'next/navigation';
import { LoginFlow } from './components/login-flow';

type LoginPageProps = {
  searchParams: Promise<{
    device_id?: string;
    state?: string;
  }>;
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const { userId } = await auth();
  const params = await searchParams;
  
  // Validate required parameters
  if (!params.device_id || !params.state) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Request</h1>
          <p className="mt-2 text-gray-600">
            Missing required parameters: device_id and state
          </p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL);
    signInUrl.searchParams.set('redirect_url', `/login?device_id=${params.device_id}&state=${params.state}`);
    redirect(signInUrl.toString());
  }

  // Check if user exists in database
  const user = await database.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">User Not Found</h1>
          <p className="mt-2 text-gray-600">
            Please contact support if this issue persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <LoginFlow 
      deviceId={params.device_id}
      state={params.state}
      user={user}
    />
  );
};

export default LoginPage;
