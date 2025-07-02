'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { Button } from '@repo/design-system/components/ui/button';
import type { Dictionary } from '@repo/internationalization';
import { ExternalLink, Github, MessageCircle } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

type CommunityProps = {
  dictionary: Dictionary;
};

// Sample community reviews data
const communityReviews = [
  {
    id: 1,
    username: 'dev_goblin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'What @cubentbase + @nextjs is amazing! 🔥 Really excited into a proof-of-concept and already have a lot of the functionality in place 🤯 🤯 🤯',
    platform: 'twitter'
  },
  {
    id: 2,
    username: 'pixiePixels',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content: 'Using @cubentbase I\'m really impressed with the developers and see it in general. Despite being a bit dubious about the fact that I have to say I really don\'t miss anything. The whole experience feels very robust and secure.',
    platform: 'twitter'
  },
  {
    id: 3,
    username: 'realJoelR',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    content: 'This weekend I made a personal record 🏆 on the last time spent creating an application with social login / permissions, database, cdn, and for free. Thanks to @cubentbase and @vercel.',
    platform: 'twitter'
  },
  {
    id: 4,
    username: 'steveOnScripts',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
    content: 'Working on my own cubent project. I want this to be my first because I\'m not a backend engineer and I\'m getting it done.',
    platform: 'twitter'
  },
  {
    id: 5,
    username: 'braydenCodes',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    content: 'New to @cubentbase I was really impressed with the developers and see it in general. Despite being a bit dubious about the fact that I have to say I really don\'t miss anything.',
    platform: 'twitter'
  },
  {
    id: 6,
    username: 'maxbyte42',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    content: 'Completed @cubentbase is it. It had the best experience I\'ve had with a database. Despite being a bit dubious about the fact that I have to say I really don\'t miss anything.',
    platform: 'twitter'
  },
  {
    id: 7,
    username: 'cassWritesCode',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    content: 'Biggest @cubentbase is amazing! Really impressed with the developers and see it in general.',
    platform: 'twitter'
  },
  {
    id: 8,
    username: 'alex0xFF',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    content: 'Just shipped my first app using @cubentbase and the developer experience is incredible! The AI features saved me hours of debugging.',
    platform: 'twitter'
  },
  {
    id: 9,
    username: 'codeKnight_',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'The context intelligence in @cubentbase is a game changer. It understands my codebase better than I do sometimes! 😅',
    platform: 'twitter'
  },
  {
    id: 10,
    username: 'mike_2stack',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    content: 'Been using @cubentbase for 3 months now. The AI screenshot analysis feature is mind-blowing - it catches UI issues I completely miss.',
    platform: 'twitter'
  },
  {
    id: 11,
    username: 'jennaDotJS',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    content: 'Finally found a coding assistant that actually understands context! @cubentbase has become essential to my workflow.',
    platform: 'twitter'
  },
  {
    id: 12,
    username: 'tom_is_typing',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
    content: 'The multi-language support in @cubentbase is fantastic. Seamlessly switching between JS, Python, and Rust in the same project.',
    platform: 'twitter'
  },
  {
    id: 13,
    username: 'anna_rmd',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    content: 'The autonomous agent mode in @cubentbase is absolutely mind-blowing. I gave it a complex task and it just... did it. No back and forth, just results.',
    platform: 'twitter'
  },
  {
    id: 14,
    username: 'liam_0x01',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face',
    content: 'Switched from Copilot to @cubentbase and the difference is night and day. The context awareness is incredible - it actually understands my project structure.',
    platform: 'twitter'
  },
  {
    id: 15,
    username: 'priyaCodesLate',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    content: 'The natural language coding in @cubentbase is revolutionary. I can literally describe what I want and it builds it perfectly. This is the future of development.',
    platform: 'twitter'
  },
  {
    id: 16,
    username: 'diego_dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    content: 'Documentation generation with @cubentbase saved our team weeks of work. It understands the code context and writes better docs than we ever could manually.',
    platform: 'twitter'
  },
  {
    id: 17,
    username: 'jamieStartups',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
    content: 'The file operations in @cubentbase are so smart. It reads my entire workspace, understands the architecture, and makes perfect modifications across multiple files.',
    platform: 'twitter'
  },
  {
    id: 18,
    username: 'mariaAIthings',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    content: 'Terminal integration in @cubentbase is a game changer. It can run commands, analyze output, and fix issues automatically. It\'s like having a DevOps expert on call.',
    platform: 'twitter'
  },
  {
    id: 19,
    username: 'soloStone',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    content: 'As a solo founder, @cubentbase is my secret weapon. It handles complex coding tasks while I focus on business strategy. Productivity through the roof! 🚀',
    platform: 'twitter'
  },
  {
    id: 20,
    username: 'natSecNerd',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content: 'The custom modes in @cubentbase are brilliant. I created a security auditor mode and it found vulnerabilities I completely missed. This tool is incredible.',
    platform: 'twitter'
  },
  {
    id: 21,
    username: 'owenWebby',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'Browser automation with @cubentbase is pure magic. It can interact with web pages, test functionality, and even debug UI issues. Mind = blown 🤯',
    platform: 'twitter'
  },
  {
    id: 22,
    username: 'aish_on_mobile',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    content: 'The code generation quality in @cubentbase is unmatched. It writes cleaner code than most junior developers and follows best practices automatically.',
    platform: 'twitter'
  },
  {
    id: 23,
    username: 'dataDan_',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    content: 'Using @cubentbase for data analysis scripts has been incredible. It understands pandas, numpy, and matplotlib better than I do sometimes! 📊',
    platform: 'twitter'
  },
  {
    id: 24,
    username: 'kubernick',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'The Docker and Kubernetes integration in @cubentbase is seamless. It can write deployment configs, debug container issues, and optimize resource usage.',
    platform: 'twitter'
  },
  {
    id: 25,
    username: 'rileyRunsScripts',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face',
    content: 'Feels like a co-pilot on steroids! @cubentbase rewrote a legacy module, added tests and opened the PR while I grabbed coffee.',
    platform: 'twitter'
  },
  {
    id: 26,
    username: 'sophDesigns',
    avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&h=150&fit=crop&crop=face',
    content: 'Docs hero: auto-generated docs are spot-on and beautifully formatted. Onboarding new engineers is now twice as fast 🚀',
    platform: 'twitter'
  },
  {
    id: 27,
    username: 'omarBugfix',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
    content: 'Bug-squashing machine! Pointed @cubentbase at failing tests and it narrowed down the root cause and pushed a fix.',
    platform: 'twitter'
  },
  {
    id: 28,
    username: 'frontendChloe',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
    content: 'The live browser preview straight from chat saves me a ton of context-switching. My UI iterations are lightning fast ⚡️',
    platform: 'twitter'
  },
  {
    id: 29,
    username: 'rustyMara',
    avatar: 'https://images.unsplash.com/photo-1502720705749-3c045fa5b72c?w=150&h=150&fit=crop&crop=face',
    content: 'Loving @cubent.dev for Rust refactors — it split my crate into modules in seconds! 🦀',
    platform: 'twitter'
  },
  {
    id: 30,
    username: 'swiftLuke',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    content: '@cubent.dev fixed three memory leaks in my iOS app and explained every change. Mind = blown.',
    platform: 'twitter'
  },
  {
    id: 31,
    username: 'jsonSteele',
    avatar: 'https://images.unsplash.com/photo-1502767089025-6572583495b9?w=150&h=150&fit=crop&crop=face',
    content: 'Live context panel in @cubent.dev means I never lose track of files. Productivity +100% 💪',
    platform: 'twitter'
  },
  {
    id: 32,
    username: 'emmaUXcreates',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    content: 'The ability to generate UI components from a simple prompt is a game-changer for my workflow. @cubent.dev is amazing!',
    platform: 'twitter'
  },
  {
    id: 33,
    username: 'carterBoots',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    content: 'I use @cubent.dev to bootstrap all my new projects. It sets up the boilerplate, CI/CD pipeline, and even initial docs.',
    platform: 'twitter'
  },
  {
    id: 34,
    username: 'testZoe',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    content: 'Generating complex test cases used to be a chore. Now, @cubent.dev writes them for me, covering all edge cases.',
    platform: 'twitter'
  }
];

export const Community = ({ dictionary }: CommunityProps) => {
  const [firstColumn, secondColumn] = useMemo(() => {
    const shuffled = [...communityReviews].sort(() => Math.random() - 0.5);
    const midPoint = Math.ceil(shuffled.length / 2);
    return [shuffled.slice(0, midPoint), shuffled.slice(midPoint)];
  }, []);

  // Create animated columns for the animation effect
  const createAnimatedColumn = (reviewsForColumn: typeof communityReviews, direction: 'left' | 'right') => {
    const reviews = [...reviewsForColumn, ...reviewsForColumn]; // Duplicate for seamless loop
    const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';

    return (
      <div className={`flex gap-8 ${animationClass}`}>
        {reviews.map((review, index) => (
          <div
            key={`${review.id}-${index}`}
            className="flex-shrink-0 w-80 bg-neutral-700/50 backdrop-blur-sm rounded-lg p-6 border border-neutral-600/40 shadow-lg hover:border-orange-600 hover:shadow-[0_0_10px_rgba(234,88,12,0.6)] hover:bg-neutral-600/60 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={review.avatar} alt={review.username} />
                <AvatarFallback>{review.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-medium text-sm">@{review.username}</span>
                  {/* X (Twitter) Logo with shadow */}
                  <div className="relative">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-white drop-shadow-lg"
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 8px rgba(255,255,255,0.1))'
                      }}
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {review.content.replace(/@cubentbase/g, '@cubent.dev')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full py-8 lg:py-12 bg-[#0a0a0a] relative overflow-hidden">
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
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/11 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center gap-10">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-white font-regular text-3xl tracking-tighter md:text-5xl mb-4">
              Join the community
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Discover what our community has to say about their Cubent experience.
            </p>
          </div>

          {/* Community Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="bg-neutral-900/50 border-neutral-700 text-white hover:bg-neutral-800/50 backdrop-blur-sm"
              asChild
            >
              <a
                href="https://github.com/cubent/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub discussions
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
            <Button
              variant="outline"
              className="bg-neutral-900/50 border-neutral-700 text-white hover:bg-neutral-800/50 backdrop-blur-sm"
              asChild
            >
              <a
                href="https://discord.gg/cubent"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Discord
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>

          {/* Animated Reviews */}
          <div className="w-full max-w-7xl mx-auto">
            <div className="space-y-12 mask-gradient">
              {/* First column - scrolling left */}
              <div className="flex flex-col gap-8">
                {createAnimatedColumn(firstColumn, 'left')}
                {createAnimatedColumn(secondColumn, 'right')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
