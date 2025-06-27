import type { Dictionary } from '@repo/internationalization';
import { Brain, Code, FileSearch, Zap, Terminal, MessageSquare } from 'lucide-react';

type FeaturesProps = {
  dictionary: Dictionary;
};

const Feature = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-left flex flex-col gap-4 ${className}`}>
    {children}
  </div>
);

const FeatureHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    {children}
  </div>
);

const FeatureTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base tracking-tight font-medium leading-6 text-white">
    {children}
  </h3>
);

const FeatureIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="w-6 h-6 text-white/80">
    <Icon className="w-full h-full" />
  </div>
);

const FeatureContent = ({ children }: { children: React.ReactNode }) => (
  <div className="text-white/60 font-normal text-sm leading-6">
    {children}
  </div>
);

export const Features = ({ }: FeaturesProps) => (
  <div className="mt-16 md:mt-32">
    <div className="flex flex-col items-center text-center mb-20">
      <h2 className="max-w-xl font-regular text-3xl tracking-tighter md:text-5xl text-white">
        Everything you need for AI-powered coding
      </h2>
      <p className="max-w-xl text-lg text-white/60 leading-relaxed tracking-tight mt-4">
        Build, debug, and refactor code with our comprehensive AI assistant that understands your entire development workflow.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3 sm:px-0">
      <Feature>
        <FeatureHeader>
          <FeatureIcon icon={Brain} />
          <FeatureTitle>Context Intelligence</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Access files, Git history, problems, terminal, and folders with intelligent context awareness. Supports 200+ programming languages including JS, TS, HTML, C++, and Python.
        </FeatureContent>
      </Feature>

      <Feature>
        <FeatureHeader>
          <FeatureIcon icon={FileSearch} />
          <FeatureTitle>AI Screenshot Analysis</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Take screenshots of your website and get instant AI analysis. Cubent can review your UI, identify issues, and provide actionable feedback on your web applications.
        </FeatureContent>
      </Feature>

      <Feature>
        <FeatureHeader>
          <FeatureIcon icon={Code} />
          <FeatureTitle>Smart Code Editing</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Read files, make intelligent edits, and review changes with accept/reject controls. Cubent understands your codebase and suggests precise modifications with diff tracking.
        </FeatureContent>
      </Feature>

      <Feature>
        <FeatureHeader>
          <FeatureIcon icon={Zap} />
          <FeatureTitle>Smart Autocomplete</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Get intelligent code completions with context-aware suggestions. Accept or reject autocomplete recommendations with full control over your coding workflow.
        </FeatureContent>
      </Feature>

      <Feature>
        <FeatureHeader>
          <FeatureIcon icon={Terminal} />
          <FeatureTitle>Terminal Integration</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Execute commands directly from the AI interface. Cubent can run tests, install packages, and manage your development environment seamlessly.
        </FeatureContent>
      </Feature>

      <Feature>
        <FeatureHeader>
          <FeatureIcon icon={MessageSquare} />
          <FeatureTitle>Natural Language Commands</FeatureTitle>
        </FeatureHeader>
        <FeatureContent>
          Communicate with your AI assistant using plain English. Describe what you want to build, and Cubent will generate the appropriate code and documentation.
        </FeatureContent>
      </Feature>
    </div>
  </div>
);
