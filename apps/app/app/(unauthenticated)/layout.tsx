import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { CommandIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  readonly children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="relative min-h-dvh w-full overflow-hidden" style={{background: 'linear-gradient(to bottom right, #000000, #1a1a1a, #0a0a0a)'}}>
    {/* Orange ambient glow effects */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/8 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/3 rounded-full blur-2xl" />
    </div>

    {/* Background grid pattern */}
    <div className="absolute inset-0 pointer-events-none opacity-30">
      {/* Programming Language Icons scattered in background */}
      <div className="absolute w-8 h-8 text-orange-400" style={{ left: '5%', top: '15%' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="m2 2h12v12h-12v-12m3.1533 10.027c0.26667 0.56667 0.79333 1.0333 1.6933 1.0333 1 0 1.6867-0.53333 1.6867-1.7v-3.8533h-1.1333v3.8267c0 0.57333-0.23333 0.72-0.6 0.72-0.38667 0-0.54667-0.26667-0.72667-0.58l-0.92 0.55333m3.9867-0.12c0.33333 0.65333 1.0067 1.1533 2.06 1.1533 1.0667 0 1.8667-0.55333 1.8667-1.5733 0-0.94-0.54-1.36-1.5-1.7733l-0.28-0.12c-0.48667-0.20667-0.69333-0.34667-0.69333-0.68 0-0.27333 0.20667-0.48667 0.54-0.48667 0.32 0 0.53333 0.14 0.72667 0.48667l0.87333-0.58c-0.36667-0.64-0.88667-0.88667-1.6-0.88667-1.0067 0-1.6533 0.64-1.6533 1.4867 0 0.92 0.54 1.3533 1.3533 1.7l0.28 0.12c0.52 0.22667 0.82667 0.36667 0.82667 0.75333 0 0.32-0.3 0.55333-0.76667 0.55333-0.55333 0-0.87333-0.28667-1.1133-0.68667z" fill="currentColor" strokeWidth=".66667"/>
        </svg>
      </div>
      <div className="absolute w-6 h-6 text-orange-300" style={{ left: '85%', top: '12%' }}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M9.86 2A2.86 2.86 0 0 0 7 4.86v1.68h4.29c.39 0 .71.57.71.96H4.86A2.86 2.86 0 0 0 2 10.36v3.781a2.86 2.86 0 0 0 2.86 2.86h1.18v-2.68a2.85 2.85 0 0 1 2.85-2.86h5.25c1.58 0 2.86-1.271 2.86-2.851V4.86A2.86 2.86 0 0 0 14.14 2zm-.72 1.61c.4 0 .72.12.72.71s-.32.891-.72.891c-.39 0-.71-.3-.71-.89s.32-.711.71-.711z" fill="currentColor"/>
          <path d="M17.959 7v2.68a2.85 2.85 0 0 1-2.85 2.859H9.86A2.85 2.85 0 0 0 7 15.389v3.75a2.86 2.86 0 0 0 2.86 2.86h4.28A2.86 2.86 0 0 0 17 19.14v-1.68h-4.291c-.39 0-.709-.57-.709-.96h7.14A2.86 2.86 0 0 0 22 13.64V9.86A2.86 2.86 0 0 0 19.14 7zM8.32 11.513l-.004.004c.012-.002.025-.001.038-.004zm6.54 7.276c.39 0 .71.3.71.89a.71.71 0 0 1-.71.71c-.4 0-.72-.12-.72-.71s.32-.89.72-.89z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-8 h-8 text-gray-400" style={{ left: '15%', top: '75%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M16,12c7.44405,0,12,2.58981,12,4s-4.55595,4-12,4S4,17.41019,4,16,8.556,12,16,12m0-2C8.268,10,2,12.68629,2,16s6.268,6,14,6,14-2.68629,14-6-6.268-6-14-6Z" fill="currentColor"/>
          <path d="M16,14a2,2,0,1,0,2,2,2,2,0,0,0-2-2Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-6 h-6 text-orange-500" style={{ left: '75%', top: '80%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" fill="currentColor"/>
          <path d="M16,24.414l-6.707-6.707,1.414-1.414L16,21.586l5.293-5.293,1.414,1.414Z" fill="currentColor"/>
        </svg>
      </div>
    </div>

    {/* Dashed grid lines with orange accents */}
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Vertical dashed lines */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          left: '20%',
          background: 'repeating-linear-gradient(to bottom, rgba(249, 115, 22, 0.4) 0 5px, transparent 5px 11px)'
        }}
      />
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          right: '20%',
          background: 'repeating-linear-gradient(to bottom, rgba(249, 115, 22, 0.4) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Horizontal dashed lines */}
      <div
        className="absolute h-px"
        style={{
          top: '20%',
          left: '20%',
          right: '20%',
          background: 'repeating-linear-gradient(to right, rgba(249, 115, 22, 0.4) 0 5px, transparent 5px 11px)'
        }}
      />
      <div
        className="absolute h-px"
        style={{
          bottom: '20%',
          left: '20%',
          right: '20%',
          background: 'repeating-linear-gradient(to right, rgba(249, 115, 22, 0.4) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Additional orange accent lines */}
      <div
        className="absolute h-px"
        style={{
          top: '50%',
          left: '10%',
          right: '10%',
          background: 'repeating-linear-gradient(to right, rgba(249, 115, 22, 0.2) 0 3px, transparent 3px 8px)'
        }}
      />
    </div>

    {/* Mode toggle in top right */}
    <div className="absolute top-4 right-4 z-30">
      <ModeToggle />
    </div>

    {/* Centered authentication content */}
    <div className="relative z-20 flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Let Clerk handle its own styling */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
