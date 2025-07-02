'use client';

import { Button } from '@repo/design-system/components/ui/button';
import Link from 'next/link';

export const Download = () => {
  return (
    <div className="w-full py-16 lg:py-24 relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="space-y-4">
            <div className="text-orange-500 text-sm font-medium tracking-wider uppercase">
              — Let's Code
            </div>
            <h2 className="text-white font-regular text-3xl tracking-tighter md:text-5xl leading-tight">
              Install our extension and<br />
              start coding today
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
              Get started with AI-powered development. Choose your preferred editor and experience the future of coding.
            </p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button
              size="lg"
              className="flex-1 bg-neutral-700/50 backdrop-blur-sm text-white border-0 rounded-lg px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:bg-neutral-600/60"
              asChild
            >
              <Link
                href="https://marketplace.visualstudio.com/items?itemName=cubent.cubent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                  </svg>
                  VS Code
                </div>
              </Link>
            </Button>

            <Button
              size="lg"
              className="flex-1 bg-neutral-700/50 backdrop-blur-sm text-white border border-neutral-600/40 rounded-lg px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:bg-neutral-600/60"
              asChild
            >
              <Link
                href="https://plugins.jetbrains.com/plugin/cubent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0v24h24V0H0zm3.723 3.111h5v1.834h-1.39v6.277h1.39v1.834h-5v-1.834h1.444V4.945H3.723V3.111zm11.055 0H17v1.834h-1.389v6.277H17v1.834h-2.222V3.111zm-8.334 8.944H9.61v1.833H6.444v-1.833z"/>
                  </svg>
                  JetBrains
                </div>
              </Link>
            </Button>
          </div>

          {/* Additional info */}
          <div className="text-center">
            <p className="text-white/50 text-sm">
              Not using Windows? <Link href="#" className="text-orange-500 hover:text-orange-400 transition-colors">View all download options</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
