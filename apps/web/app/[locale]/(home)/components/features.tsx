import type { Dictionary } from '@repo/internationalization';
import { Brain, Code, FileSearch, Zap, Plus } from 'lucide-react';

type FeaturesProps = {
  dictionary: Dictionary;
};

export const Features = ({ dictionary }: FeaturesProps) => (
  <div className="w-full py-20 lg:py-40 bg-black">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl text-white">
              {dictionary.web.home.features.title}
            </h2>
            <p className="max-w-xl text-left text-lg text-gray-400 leading-relaxed tracking-tight lg:max-w-lg">
              {dictionary.web.home.features.description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1: Context Intelligence */}
          <div className="group relative flex flex-col justify-between p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 aspect-square">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Context Intelligence
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Access files, Git history, problems, terminal, and folders with intelligent context awareness. Supports 200+ programming languages.
                </p>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Feature 2: AI Analysis */}
          <div className="group relative flex flex-col justify-between p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 aspect-square">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <FileSearch className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  AI Screenshot Analysis
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Take screenshots of your website and get instant AI analysis. Review your UI, identify issues, and get actionable feedback.
                </p>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Feature 3: Code Intelligence */}
          <div className="group relative flex flex-col justify-between p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 aspect-square">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Code className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Smart Code Editing
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Read files, make intelligent edits, and review changes with accept/reject controls. Precise modifications with diff tracking.
                </p>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Feature 4: Autocomplete */}
          <div className="group relative flex flex-col justify-between p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 aspect-square">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Smart Autocomplete
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Get intelligent code completions with context-aware suggestions. Full control over your coding workflow.
                </p>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
