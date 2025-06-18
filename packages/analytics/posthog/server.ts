import 'server-only';
import { PostHog } from 'posthog-node';
import { keys } from '../keys';

const envKeys = keys();

export const analytics = envKeys.NEXT_PUBLIC_POSTHOG_KEY && envKeys.NEXT_PUBLIC_POSTHOG_HOST
  ? new PostHog(envKeys.NEXT_PUBLIC_POSTHOG_KEY, {
      host: envKeys.NEXT_PUBLIC_POSTHOG_HOST,

      // Don't batch events and flush immediately - we're running in a serverless environment
      flushAt: 1,
      flushInterval: 0,
    })
  : null;
