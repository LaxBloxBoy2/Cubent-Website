import { SignIn } from '@repo/auth/client';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your Cubent dashboard
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-lg border",
            }
          }}
          redirectUrl="/profile"
        />
      </div>
    </div>
  );
}
