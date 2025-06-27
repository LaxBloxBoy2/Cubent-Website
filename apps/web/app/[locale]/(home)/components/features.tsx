import type { Dictionary } from '@repo/internationalization';
import { User } from 'lucide-react';
import Image from 'next/image';

type FeaturesProps = {
  dictionary: Dictionary;
};

export const Features = ({ dictionary }: FeaturesProps) => (
  <div className="w-full py-20 lg:py-40 bg-gray-950">
    <div className="container mx-auto px-8 sm:px-12 lg:px-16">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
              {dictionary.web.home.features.title}
            </h2>
            <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
              {dictionary.web.home.features.description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 px-4 sm:px-8 lg:px-12">
          {/* Feature 1: Context Intelligence */}
          <div className="flex flex-col rounded-xl bg-muted overflow-hidden shadow-lg shadow-black/20 aspect-square">
            <div className="relative h-48 w-full">
              <Image
                src="/images/cubent-feature-1.png"
                alt="Cubent Context Intelligence"
                fill
                className="object-cover rounded-t-xl"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-xl tracking-tight mb-2">
                @ Context Intelligence
              </h3>
              <p className="text-base text-muted-foreground">
                Access files, Git history, problems, terminal, and folders with intelligent context awareness. Supports 200+ programming languages including JS, TS, HTML, C++, and Python.
              </p>
            </div>
          </div>

          {/* Feature 2: AI Analysis */}
          <div className="flex flex-col rounded-xl bg-muted overflow-hidden shadow-lg shadow-black/20 aspect-square">
            <div className="relative h-48 w-full">
              <Image
                src="/images/cubent-feature-2.png"
                alt="Cubent AI Analysis"
                fill
                className="object-cover rounded-t-xl"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-xl tracking-tight mb-2">
                AI Screenshot Analysis
              </h3>
              <p className="text-base text-muted-foreground">
                Take screenshots of your website and get instant AI analysis. Cubent can review your UI, identify issues, and provide actionable feedback on your web applications.
              </p>
            </div>
          </div>

          {/* Feature 3: Code Intelligence */}
          <div className="flex flex-col rounded-xl bg-muted overflow-hidden shadow-lg shadow-black/20 aspect-square">
            <div className="relative h-48 w-full">
              <Image
                src="/images/cubent-feature-3.png"
                alt="Cubent Code Intelligence"
                fill
                className="object-cover rounded-t-xl"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-xl tracking-tight mb-2">
                Smart Code Editing
              </h3>
              <p className="text-base text-muted-foreground">
                Read files, make intelligent edits, and review changes with accept/reject controls. Cubent understands your codebase and suggests precise modifications with diff tracking.
              </p>
            </div>
          </div>

          {/* Feature 4: Autocomplete */}
          <div className="flex flex-col rounded-xl bg-muted overflow-hidden shadow-lg shadow-black/20 aspect-square">
            <div className="relative h-48 w-full">
              <Image
                src="/images/cubent-feature-4.png"
                alt="Cubent Smart Autocomplete"
                fill
                className="object-cover rounded-t-xl"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-xl tracking-tight mb-2">
                Smart Autocomplete
              </h3>
              <p className="text-base text-muted-foreground">
                Get intelligent code completions with context-aware suggestions. Accept or reject autocomplete recommendations with full control over your coding workflow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
