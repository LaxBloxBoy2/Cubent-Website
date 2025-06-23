import { env } from '@/env';
import { authMiddleware } from '@repo/auth/middleware';
import { internationalizationMiddleware } from '@repo/internationalization/middleware';
import { parseError } from '@repo/observability/error';
import { secure } from '@repo/security';
import {
  noseconeMiddleware,
  noseconeOptions,
  noseconeOptionsWithToolbar,
} from '@repo/security/middleware';
import {
  type NextMiddleware,
  type NextRequest,
  NextResponse,
} from 'next/server';

export const config = {
  // matcher tells Next.js which routes to run the middleware on. This runs the
  // middleware on all routes except for static assets and Posthog ingest
  matcher: ['/((?!_next/static|_next/image|images|ingest|favicon.ico).*)'],
};

const securityHeaders = env.FLAGS_SECRET
  ? noseconeMiddleware(noseconeOptionsWithToolbar)
  : noseconeMiddleware(noseconeOptions);

const middleware = authMiddleware(async (auth, request) => {
  // Handle redirects to app for profile pages
  if (request.nextUrl.pathname === '/profile' || request.nextUrl.pathname.startsWith('/profile/')) {
    const appUrl = env.NEXT_PUBLIC_DOCS_URL || 'https://app.cubent.com';
    return NextResponse.redirect(new URL(request.nextUrl.pathname, appUrl));
  }

  const i18nResponse = internationalizationMiddleware(
    request as unknown as NextRequest
  );
  if (i18nResponse) {
    return i18nResponse;
  }

  if (!env.ARCJET_KEY) {
    return securityHeaders();
  }

  try {
    await secure(
      [
        // See https://docs.arcjet.com/bot-protection/identifying-bots
        'CATEGORY:SEARCH_ENGINE', // Allow search engines
        'CATEGORY:PREVIEW', // Allow preview links to show OG images
        'CATEGORY:MONITOR', // Allow uptime monitoring services
      ],
      request
    );

    return securityHeaders();
  } catch (error) {
    const message = parseError(error);

    return NextResponse.json({ error: message }, { status: 403 });
  }
}) as unknown as NextMiddleware;

export default middleware;
