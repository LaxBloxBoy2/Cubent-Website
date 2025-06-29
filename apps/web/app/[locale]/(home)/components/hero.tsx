import { env } from '@/env';
import { blog } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { Button } from '@repo/design-system/components/ui/button';
import type { Dictionary } from '@repo/internationalization';
import { MoveRight, PhoneCall } from 'lucide-react';
import Link from 'next/link';

type HeroProps = {
  dictionary: Dictionary;
};

// Hero component for the homepage
export const Hero = async ({ dictionary }: HeroProps) => (
  <div className="w-full relative overflow-hidden">
    {/* EXACT dashed grid lines from HTML example */}
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Left vertical dashed line - 92px from left edge */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          left: '92px',
          background: 'repeating-linear-gradient(to bottom, #3e3e3e 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Right vertical dashed line - 92px from right edge */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          right: '92px',
          background: 'repeating-linear-gradient(to bottom, #3e3e3e 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Top horizontal dashed line - 128px from top */}
      <div
        className="absolute h-px"
        style={{
          top: '128px',
          left: '92px',
          right: '92px',
          background: 'repeating-linear-gradient(to right, #3e3e3e 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Bottom horizontal dashed line - 128px from bottom */}
      <div
        className="absolute h-px"
        style={{
          bottom: '128px',
          left: '92px',
          right: '92px',
          background: 'repeating-linear-gradient(to right, #3e3e3e 0 5px, transparent 5px 11px)'
        }}
      />
    </div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-8 pt-6 pb-8 lg:pt-12 lg:pb-12">
        <div>
          <Feed queries={[blog.latestPostQuery]}>
            {/* biome-ignore lint/suspicious/useAwait: "Server Actions must be async" */}
            {async ([data]: [any]) => {
              'use server';

              return (
                <Button variant="secondary" size="sm" className="gap-4" asChild>
                  <Link href={`/blog/${data.blog.posts.item?._slug}`}>
                    {dictionary.web.home.hero.announcement}{' '}
                    <MoveRight className="h-4 w-4" />
                  </Link>
                </Button>
              );
            }}
          </Feed>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="max-w-2xl text-center font-regular text-5xl tracking-tighter md:text-7xl">
            {dictionary.web.home.meta.title}
          </h1>
          <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
            {dictionary.web.home.meta.description}
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <Button size="lg" className="gap-4" variant="outline" asChild>
            <Link href="/contact">
              Get in touch <PhoneCall className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" className="gap-4" asChild>
            <Link href={env.NEXT_PUBLIC_APP_URL}>
              Sign up <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
