"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Highlight, type PrismTheme } from "prism-react-renderer";

interface CodeEditorProps {
  codeBlock: string;
  language: string;
  theme?: PrismTheme;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  codeBlock,
  language,
  theme,
  className
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-white/10 bg-black/50 backdrop-blur-sm",
        className
      )}
    >
      {/* Code editor header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs text-white/60">
          Terminal
        </div>
      </div>

      {/* Code content */}
      <div className="p-4 font-mono text-sm">
        <Highlight theme={theme} code={codeBlock} language={language}>
          {({ tokens, getLineProps, getTokenProps }) => {
            const lineCount = tokens.length;
            const gutterPadLength = Math.max(String(lineCount).length, 2);
            return (
              <pre
                key={codeBlock} // Use codeBlock as a key to trigger animations on change
                className="leading-6"
              >
                {tokens.map((line, i) => {
                  const lineNumber = i + 1;
                  const paddedLineGutter = String(lineNumber).padStart(gutterPadLength, " ");
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: I got nothing better right now
                    <div key={`${line}-${i}`} {...getLineProps({ line })}>
                      <span className="text-white/40 select-none mr-4">
                        {paddedLineGutter}
                      </span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  );
                })}
              </pre>
            );
          }}
        </Highlight>
      </div>
    </div>
  );
};

interface CodeLineProps {
  children: React.ReactNode;
  className?: string;
}

export const CodeLine: React.FC<CodeLineProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("text-white/90", className)}>
      {children}
    </div>
  );
};

interface CodeCommentProps {
  children: React.ReactNode;
  className?: string;
}

export const CodeComment: React.FC<CodeCommentProps> = ({ 
  children, 
  className 
}) => {
  return (
    <span className={cn("text-green-400/70", className)}>
      {children}
    </span>
  );
};

interface CodeKeywordProps {
  children: React.ReactNode;
  className?: string;
}

export const CodeKeyword: React.FC<CodeKeywordProps> = ({ 
  children, 
  className 
}) => {
  return (
    <span className={cn("text-blue-400", className)}>
      {children}
    </span>
  );
};

interface CodeStringProps {
  children: React.ReactNode;
  className?: string;
}

export const CodeString: React.FC<CodeStringProps> = ({ 
  children, 
  className 
}) => {
  return (
    <span className={cn("text-yellow-400", className)}>
      {children}
    </span>
  );
};

interface CodeVariableProps {
  children: React.ReactNode;
  className?: string;
}

export const CodeVariable: React.FC<CodeVariableProps> = ({ 
  children, 
  className 
}) => {
  return (
    <span className={cn("text-purple-400", className)}>
      {children}
    </span>
  );
};
