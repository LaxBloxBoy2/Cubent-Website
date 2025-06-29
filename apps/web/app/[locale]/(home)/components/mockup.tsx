'use client';

import Image from 'next/image';

export const Mockup = () => (
  <div className="w-full relative">
    {/* Dynamic Grid Background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent">
        {/* Animated Grid Lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1"/>
            </pattern>
            <linearGradient id="gridFade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.05)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.15)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.6" />

          {/* Animated diagonal lines */}
          <g className="animate-pulse" style={{ animationDuration: '3s' }}>
            <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="url(#gridFade)" strokeWidth="2" opacity="0.3" />
            <line x1="0%" y1="100%" x2="100%" y2="0%" stroke="url(#gridFade)" strokeWidth="2" opacity="0.3" />
          </g>

          {/* Floating dots with staggered animation */}
          <g>
            <circle cx="20%" cy="30%" r="2" fill="rgba(59, 130, 246, 0.4)" className="animate-pulse" style={{ animationDelay: '0s', animationDuration: '2s' }} />
            <circle cx="80%" cy="70%" r="2" fill="rgba(59, 130, 246, 0.4)" className="animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
            <circle cx="60%" cy="20%" r="2" fill="rgba(59, 130, 246, 0.4)" className="animate-pulse" style={{ animationDelay: '1s', animationDuration: '2s' }} />
            <circle cx="30%" cy="80%" r="2" fill="rgba(59, 130, 246, 0.4)" className="animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '2s' }} />
          </g>

          {/* Moving connection lines */}
          <g className="animate-pulse" style={{ animationDuration: '4s' }}>
            <line x1="20%" y1="30%" x2="60%" y2="20%" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="60%" y1="20%" x2="80%" y2="70%" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="80%" y1="70%" x2="30%" y2="80%" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="30%" y1="80%" x2="20%" y2="30%" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
          </g>
        </svg>
      </div>
    </div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="relative w-full max-w-6xl">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/images/hero-mockup.png"
                alt="Cubent Editor Interface - Code editing with AI assistance"
                width={1200}
                height={800}
                className="w-full h-auto object-cover rounded-lg"
                priority
              />
              {/* Gradient overlay for better integration */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
            </div>
            {/* Soft glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-30 -z-10" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
