"use client";
import { AnimatedList } from "./animated-list";

export function CubentBento() {
  return (
    <div className="w-full space-y-4">
      {/* Top Row - 2 Bento Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditingBento />
        <ContextIntelligenceBento />
      </div>

      {/* Bottom Row - 2 Bento Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AIAnalysisBento />
        <AutocompleteBento />
      </div>
    </div>
  );
}

// 1. Code Editing Workflow Bento
export function CodeEditingBento() {
  return (
    <div className="relative border-[.75px] h-[300px] rounded-[24px] border-[#ffffff]/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <TerminalIcon />
          <h3 className="ml-3 text-lg font-medium text-white">Code Intelligence</h3>
        </div>

        <div className="space-y-3">
          {/* Terminal */}
          <div className="bg-black/30 rounded-lg p-3 border border-white/10">
            <div className="flex items-center text-sm text-white/80">
              <span className="text-green-400">{'>'}</span>
              <span className="ml-2">Terminal</span>
            </div>
          </div>

          {/* Read File */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-white/10">
            <div className="flex items-center">
              <FileIcon />
              <div className="ml-3">
                <div className="text-white text-sm font-medium">Read File</div>
                <div className="text-white/60 text-xs">app.ts</div>
              </div>
            </div>
          </div>

          {/* Edited File */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <EditIcon />
                <div className="ml-3">
                  <div className="text-white text-sm font-medium">Edited File</div>
                  <div className="text-white/60 text-xs">app.ts</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-green-400">+4</span>
                <span className="text-red-400">-1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accept/Reject Buttons */}
        <div className="absolute bottom-4 left-6 right-6 flex space-x-2">
          <button className="flex-1 bg-green-600/20 border border-green-500/30 rounded-lg py-2 px-3 text-green-400 text-sm flex items-center justify-center">
            <CheckIcon />
            <span className="ml-2">Accept Edit</span>
          </button>
          <button className="flex-1 bg-red-600/20 border border-red-500/30 rounded-lg py-2 px-3 text-red-400 text-sm flex items-center justify-center">
            <XIcon />
            <span className="ml-2">Reject Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Context Intelligence Bento
export function ContextIntelligenceBento() {
  const contextSources = [
    { name: "Files", icon: "📁", active: true },
    { name: "Git", icon: "🔀", active: false },
    { name: "Problems", icon: "⚠️", active: true },
    { name: "Terminal", icon: "💻", active: false },
    { name: "Files", icon: "📄", active: true },
    { name: "Folders", icon: "📂", active: false },
  ];

  const languages = ["JS", "TS", "HTML", "C++", "Python"];

  return (
    <div className="relative border-[.75px] h-[300px] rounded-[24px] border-[#ffffff]/10 bg-gradient-to-br from-blue-900/30 to-purple-900/30 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <ContextIcon />
          <h3 className="ml-3 text-lg font-medium text-white">@ Context</h3>
        </div>

        {/* Context Sources Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {contextSources.map((source, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border transition-all ${
                source.active
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-white/5 border-white/10 text-white/60"
              }`}
            >
              <div className="flex items-center">
                <span className="text-lg mr-2">{source.icon}</span>
                <span className="text-sm font-medium">{source.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Language Support */}
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {languages.map((lang, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 bg-white/10 rounded border border-white/20 flex items-center justify-center text-xs font-medium text-white"
                >
                  {lang}
                </div>
              ))}
            </div>
            <div className="text-white/60 text-sm">+200</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. AI Analysis Bento
export function AIAnalysisBento() {
  return (
    <div className="relative border-[.75px] h-[300px] rounded-[24px] border-[#ffffff]/10 bg-gradient-to-br from-green-900/30 to-teal-900/30 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <BrowserIcon />
          <h3 className="ml-3 text-lg font-medium text-white">AI Analysis</h3>
        </div>

        {/* Browser Preview */}
        <div className="bg-black/30 rounded-lg p-3 border border-white/10 mb-4">
          <div className="flex items-center mb-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="ml-3 text-xs text-white/60">localhost:3000</div>
          </div>
          <div className="bg-white/5 rounded p-2 text-xs text-white/80">
            <div className="font-medium mb-1">Give your big idea the website it deserves</div>
            <div className="text-white/60">Landing page components built with React...</div>
          </div>
        </div>

        {/* AI Response */}
        <div className="space-y-2">
          <div className="text-sm text-white/80">
            "Great i took a screenshot of the website and everything seems fine"
          </div>
          <div className="text-sm text-white/60">
            "Is there anything else you want me to analyse?"
          </div>
        </div>

        {/* Status */}
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-green-400">Analysis Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Autocomplete Bento
export function AutocompleteBento() {
  return (
    <div className="relative border-[.75px] h-[300px] rounded-[24px] border-[#ffffff]/10 bg-gradient-to-br from-orange-900/30 to-yellow-900/30 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <AutocompleteIcon />
          <h3 className="ml-3 text-lg font-medium text-white">Smart Autocomplete</h3>
        </div>

        {/* Code Preview */}
        <div className="bg-black/40 rounded-lg p-3 border border-white/10 mb-4 font-mono text-xs">
          <div className="text-white/60">@Override</div>
          <div className="text-white/80">protected void paintComponent(Graphics g) {</div>
          <div className="text-white/80 ml-4">super.paintComponent(g);</div>
          <div className="text-white/80 ml-4">setBackground(Color.black);</div>
          <div className="text-green-400 ml-4">double angleVariation = rand.nextDouble() * 20 + 10;</div>
          <div className="text-green-400 ml-4">double shrink = rand.nextDouble() * 0.2 + 0.7;</div>
          <div className="text-white/60">}</div>
        </div>

        {/* Accept/Reject Autocomplete */}
        <div className="absolute bottom-4 left-6 right-6 flex space-x-2">
          <button className="flex-1 bg-green-600/20 border border-green-500/30 rounded-lg py-2 px-3 text-green-400 text-sm flex items-center justify-center">
            <CheckIcon />
            <span className="ml-2">Accept Autocomplete</span>
          </button>
          <button className="flex-1 bg-red-600/20 border border-red-500/30 rounded-lg py-2 px-3 text-red-400 text-sm flex items-center justify-center">
            <XIcon />
            <span className="ml-2">Reject Autocomplete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Icon components for Cubent bento features
const TerminalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M7 15L12 10L7 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 19H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ContextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
    <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BrowserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="white" strokeWidth="2" />
    <line x1="8" y1="21" x2="16" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="17" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AutocompleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


