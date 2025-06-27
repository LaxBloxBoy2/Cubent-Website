import { env } from '@/env';
import { blog } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { Button } from '@repo/design-system/components/ui/button';
import type { Dictionary } from '@repo/internationalization';
import { MoveRight, PhoneCall, Download, BookOpen } from 'lucide-react';
import Link from 'next/link';

type HeroProps = {
  dictionary: Dictionary;
};

// Hero component for the homepage
export const Hero = async ({ dictionary }: HeroProps) => (
  <div className="relative w-full pt-6 overflow-hidden">
    <div className="container relative mx-auto">
      <div className="container relative flex flex-col mx-auto space-y-16 md:space-y-32">
        <div className="relative w-full flex flex-col items-center justify-between mt-48">
          <div className="relative flex flex-col items-center text-center">
            <h1 className="bg-gradient-to-br text-balance text-transparent bg-gradient-stop bg-clip-text from-white via-white via-30% to-white/30 font-medium text-6xl leading-none xl:text-[82px] tracking-tighter">
              AI-Powered Autonomous Coding Agent
            </h1>

            <p className="mt-6 sm:mt-8 bg-gradient-to-br text-transparent text-balance bg-gradient-stop bg-clip-text max-w-sm sm:max-w-lg xl:max-w-4xl from-white/70 via-white/70 via-40% to-white/30 text-base md:text-lg">
              Transform your VS Code experience with Cubent Coder. Generate, refactor, and debug code using natural language commands while maintaining full control over your development workflow.
            </p>

            <div className="flex items-center gap-6 mt-16">
              <Link href="https://marketplace.visualstudio.com/items?itemName=cubent.cubent" className="group">
                <Button size="lg" className="gap-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                  <Download className="h-4 w-4" />
                  Install Extension
                </Button>
              </Link>

              <Link href="https://docs.cubent.com" className="hidden sm:flex">
                <Button size="lg" variant="outline" className="gap-4 border-white/20 text-white hover:bg-white/10">
                  <BookOpen className="h-4 w-4" />
                  Documentation
                  <MoveRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
