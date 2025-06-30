import { env } from '@/env';
import { blog } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { Button } from '@repo/design-system/components/ui/button';
import type { Dictionary } from '@repo/internationalization';
import { MoveRight, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { AnimatedTitle } from './animated-title';

type HeroProps = {
  dictionary: Dictionary;
};

// Hero component for the homepage
export const Hero = async ({ dictionary }: HeroProps) => (
  <div className="w-full relative overflow-hidden -mt-20 pt-20">
    {/* Grid background extending behind header */}
    <div
      className="absolute inset-0 -top-20 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    />
    {/* Evenly spaced dashed grid lines that frame content without conflicting */}
    <div className="absolute inset-0 -top-20 pointer-events-none z-10">
      {/* Left vertical dashed line */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          left: '10%',
          background: 'repeating-linear-gradient(to bottom, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Right vertical dashed line */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          right: '10%',
          background: 'repeating-linear-gradient(to bottom, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Top horizontal dashed line - above content */}
      <div
        className="absolute h-px"
        style={{
          top: '20px',
          left: '10%',
          right: '10%',
          background: 'repeating-linear-gradient(to right, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Middle horizontal line - between announcement and headline */}
      <div
        className="absolute h-px"
        style={{
          top: '20%',
          left: '10%',
          right: '10%',
          background: 'repeating-linear-gradient(to right, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Bottom horizontal line - below buttons */}
      <div
        className="absolute h-px"
        style={{
          bottom: '20px',
          left: '10%',
          right: '10%',
          background: 'repeating-linear-gradient(to right, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
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
        <div className="flex flex-col gap-6 relative">
          {/* Natural flowing white gradient background extending behind header */}
          <div className="absolute inset-0 -top-32 bg-gradient-to-b from-white/11 via-white/7 to-transparent blur-3xl -z-10 scale-150" />
          <div className="absolute inset-0 -top-24 bg-gradient-radial from-white/11 via-white/6 to-transparent blur-2xl -z-10 scale-125" />
          <AnimatedTitle />
          <p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl relative z-10">
            Meet Cubent Coder, the autonomous AI coding assistant that lives in your editor. Generate code, debug issues, write documentation, and automate tasks with natural language commands.
          </p>
        </div>
        <div className="flex flex-row gap-4 mt-2">
          <Button size="lg" className="gap-4 bg-black border border-gray-800 text-white hover:bg-gray-900 rounded-full px-8 py-4 text-lg font-medium" asChild>
            <Link href="https://marketplace.visualstudio.com/items?itemName=cubent.cubent" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
              </svg>
              VS Code
            </Link>
          </Button>
          <Button size="lg" className="gap-4 bg-black border border-gray-800 text-white hover:bg-gray-900 rounded-full px-8 py-4 text-lg font-medium" asChild>
            <Link href="https://plugins.jetbrains.com/plugin/cubent" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 0v24h24V0H0zm3.723 3.111h5v1.834h-1.39v6.277h1.39v1.834h-5v-1.834h1.444V4.945H3.723V3.111zm11.055 0H17v1.834h-1.389v6.277H17v1.834h-2.222V3.111zm-8.334 8.944H9.61v1.833H6.444v-1.833z"/>
              </svg>
              JetBrains
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
