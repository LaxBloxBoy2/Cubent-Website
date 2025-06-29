'use client';

import Image from 'next/image';

export const Mockup = () => (
  <div className="w-full relative">
    {/* EXACT Grid Lines as drawn */}
    <div className="absolute inset-0 pointer-events-none z-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Vertical Lines - exactly as drawn */}
        <g stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1">
          <line x1="12.5%" y1="0%" x2="12.5%" y2="100%" />
          <line x1="25%" y1="0%" x2="25%" y2="100%" />
          <line x1="37.5%" y1="0%" x2="37.5%" y2="100%" />
          <line x1="50%" y1="0%" x2="50%" y2="100%" />
          <line x1="62.5%" y1="0%" x2="62.5%" y2="100%" />
          <line x1="75%" y1="0%" x2="75%" y2="100%" />
          <line x1="87.5%" y1="0%" x2="87.5%" y2="100%" />
        </g>

        {/* Horizontal Lines - exactly as drawn */}
        <g stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1">
          <line x1="0%" y1="20%" x2="100%" y2="20%" />
          <line x1="0%" y1="40%" x2="100%" y2="40%" />
          <line x1="0%" y1="60%" x2="100%" y2="60%" />
          <line x1="0%" y1="80%" x2="100%" y2="80%" />
        </g>
      </svg>
    </div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="relative w-full max-w-6xl">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 shadow-2xl">
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
