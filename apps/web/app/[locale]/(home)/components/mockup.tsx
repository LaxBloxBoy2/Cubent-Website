import Image from 'next/image';

export const Mockup = () => (
  <div className="w-full">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-8 py-20">
        <div className="relative w-full max-w-6xl">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 shadow-2xl">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/images/hero-mockup.png"
                alt="Cubent Editor Interface - Code editing with AI assistance"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
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
