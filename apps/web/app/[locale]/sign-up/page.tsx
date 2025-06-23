import { SignUp } from '@repo/auth/client';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Get started</h1>
          <p className="text-muted-foreground mt-2">
            Create your account to start using Cubent
          </p>
        </div>
        <SignUp 
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
