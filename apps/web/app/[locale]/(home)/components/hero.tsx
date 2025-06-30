import { env } from '@/env';
import { blog } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { Button } from '@repo/design-system/components/ui/button';
import type { Dictionary } from '@repo/internationalization';
import { MoveRight, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { AnimatedTitle } from './animated-title';

type HeroProps = {
  dictionary: Dictionary;
};

// Hero component for the homepage
export const Hero = async ({ dictionary }: HeroProps) => (
  <div className="w-full relative overflow-hidden -mt-20 pt-20">
    {/* Static coding languages and symbols background */}
    <div className="absolute inset-0 -top-20 pointer-events-none overflow-hidden opacity-15">
      {/* Programming Language Icons */}
      <div className="absolute w-8 h-8 text-gray-400" style={{ left: '5%', top: '15%' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="m2 2h12v12h-12v-12m3.1533 10.027c0.26667 0.56667 0.79333 1.0333 1.6933 1.0333 1 0 1.6867-0.53333 1.6867-1.7v-3.8533h-1.1333v3.8267c0 0.57333-0.23333 0.72-0.6 0.72-0.38667 0-0.54667-0.26667-0.72667-0.58l-0.92 0.55333m3.9867-0.12c0.33333 0.65333 1.0067 1.1533 2.06 1.1533 1.0667 0 1.8667-0.55333 1.8667-1.5733 0-0.94-0.54-1.36-1.5-1.7733l-0.28-0.12c-0.48667-0.20667-0.69333-0.34667-0.69333-0.68 0-0.27333 0.20667-0.48667 0.54-0.48667 0.32 0 0.53333 0.14 0.72667 0.48667l0.87333-0.58c-0.36667-0.64-0.88667-0.88667-1.6-0.88667-1.0067 0-1.6533 0.64-1.6533 1.4867 0 0.92 0.54 1.3533 1.3533 1.7l0.28 0.12c0.52 0.22667 0.82667 0.36667 0.82667 0.75333 0 0.32-0.3 0.55333-0.76667 0.55333-0.55333 0-0.87333-0.28667-1.1133-0.68667z" fill="currentColor" strokeWidth=".66667"/>
        </svg>
      </div>
      <div className="absolute w-6 h-6 text-gray-400" style={{ left: '85%', top: '12%' }}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M9.86 2A2.86 2.86 0 0 0 7 4.86v1.68h4.29c.39 0 .71.57.71.96H4.86A2.86 2.86 0 0 0 2 10.36v3.781a2.86 2.86 0 0 0 2.86 2.86h1.18v-2.68a2.85 2.85 0 0 1 2.85-2.86h5.25c1.58 0 2.86-1.271 2.86-2.851V4.86A2.86 2.86 0 0 0 14.14 2zm-.72 1.61c.4 0 .72.12.72.71s-.32.891-.72.891c-.39 0-.71-.3-.71-.89s.32-.711.71-.711z" fill="currentColor"/>
          <path d="M17.959 7v2.68a2.85 2.85 0 0 1-2.85 2.859H9.86A2.85 2.85 0 0 0 7 15.389v3.75a2.86 2.86 0 0 0 2.86 2.86h4.28A2.86 2.86 0 0 0 17 19.14v-1.68h-4.291c-.39 0-.709-.57-.709-.96h7.14A2.86 2.86 0 0 0 22 13.64V9.86A2.86 2.86 0 0 0 19.14 7zM8.32 11.513l-.004.004c.012-.002.025-.001.038-.004zm6.54 7.276c.39 0 .71.3.71.89a.71.71 0 0 1-.71.71c-.4 0-.72-.12-.72-.71s.32-.89.72-.89z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-8 h-8 text-gray-400" style={{ left: '15%', top: '25%' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="m2 2h12v12h-12v-12m7.14 9.9067c0.33333 0.65333 1.0067 1.1533 2.06 1.1533 1.0667 0 1.8667-0.55333 1.8667-1.5733 0-0.94-0.54-1.36-1.5-1.7733l-0.28-0.12c-0.48667-0.20667-0.69333-0.34667-0.69333-0.68 0-0.27333 0.20667-0.48667 0.54-0.48667 0.32 0 0.53333 0.14 0.72667 0.48667l0.87333-0.58c-0.36667-0.64-0.88667-0.88667-1.6-0.88667-1.0067 0-1.6533 0.64-1.6533 1.4867 0 0.92 0.54 1.3533 1.3533 1.7l0.28 0.12c0.52 0.22667 0.82667 0.36667 0.82667 0.75333 0 0.32-0.3 0.55333-0.76667 0.55333-0.55333 0-0.87333-0.28667-1.1133-0.68667l-0.92 0.53333m-0.47333-4.4067h-3.3333v1h1v4.8333h1.1667v-4.8333h1.1667z" fill="currentColor" strokeWidth=".66667"/>
        </svg>
      </div>
      <div className="absolute w-6 h-6 text-gray-400" style={{ left: '75%', top: '28%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M16,12c7.44405,0,12,2.58981,12,4s-4.55595,4-12,4S4,17.41019,4,16,8.556,12,16,12m0-2C8.268,10,2,12.68629,2,16s6.268,6,14,6,14-2.68629,14-6-6.268-6-14-6Z" fill="currentColor"/>
          <path d="M16,14a2,2,0,1,0,2,2,2,2,0,0,0-2-2Z" fill="currentColor"/>
          <path d="M10.45764,5.50706C12.47472,5.50746,16.395,8.68416,19.4641,14,23.18613,20.44672,23.22125,25.68721,22,26.3923a.90009.90009,0,0,1-.45691.10064c-2.01725,0-5.93792-3.17678-9.00721-8.49294C8.81387,11.55328,8.77875,6.31279,10,5.6077a.90278.90278,0,0,1,.45766-.10064m-.00076-2A2.87113,2.87113,0,0,0,9,3.87564C6.13025,5.5325,6.93785,12.30391,10.80385,19c3.28459,5.68906,7.71948,9.49292,10.73927,9.49292A2.87033,2.87033,0,0,0,23,28.12436C25.86975,26.4675,25.06215,19.69609,21.19615,13c-3.28459-5.68906-7.71948-9.49342-10.73927-9.49292Z" fill="currentColor"/>
          <path d="M21.54311,5.50706A.9.9,0,0,1,22,5.6077c1.22125.70509,1.18613,5.94558-2.5359,12.3923-3.06929,5.31616-6.99,8.49294-9.00721,8.49294A.9.9,0,0,1,10,26.3923C8.77875,25.68721,8.81387,20.44672,12.5359,14c3.06929-5.31616,6.99-8.49294,9.00721-8.49294m0-2c-3.01979,0-7.45468,3.80386-10.73927,9.49292C6.93785,19.69609,6.13025,26.4675,9,28.12436a2.87033,2.87033,0,0,0,1.45688.36856c3.01979,0,7.45468-3.80386,10.73927-9.49292C25.06215,12.30391,25.86975,5.5325,23,3.87564a2.87033,2.87033,0,0,0-1.45688-.36856Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-8 h-8 text-gray-400" style={{ left: '8%', top: '35%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z" fill="currentColor"/>
          <path d="M16,24.414l-6.707-6.707,1.414-1.414L16,21.586l5.293-5.293,1.414,1.414Z" fill="currentColor"/>
          <path d="M9,15H23v2H9Z" fill="currentColor"/>
          <path d="M15,9h2V23H15Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-6 h-6 text-gray-400" style={{ left: '88%', top: '38%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M11.622,11.238V9.2a.4.4,0,0,1,.4-.4H20.4a.4.4,0,0,1,.4.4v2.036a.4.4,0,0,1-.4.4H12.022A.4.4,0,0,1,11.622,11.238Z" fill="currentColor"/>
          <path d="M11.622,15.6V13.564a.4.4,0,0,1,.4-.4H20.4a.4.4,0,0,1,.4.4V15.6a.4.4,0,0,1-.4.4H12.022A.4.4,0,0,1,11.622,15.6Z" fill="currentColor"/>
          <path d="M11.622,19.964V17.928a.4.4,0,0,1,.4-.4H20.4a.4.4,0,0,1,.4.4v2.036a.4.4,0,0,1-.4.4H12.022A.4.4,0,0,1,11.622,19.964Z" fill="currentColor"/>
          <path d="M7.2,11.238V9.2a.4.4,0,0,1,.4-.4H9.636a.4.4,0,0,1,.4.4v2.036a.4.4,0,0,1-.4.4H7.6A.4.4,0,0,1,7.2,11.238Z" fill="currentColor"/>
          <path d="M7.2,15.6V13.564a.4.4,0,0,1,.4-.4H9.636a.4.4,0,0,1,.4.4V15.6a.4.4,0,0,1-.4.4H7.6A.4.4,0,0,1,7.2,15.6Z" fill="currentColor"/>
          <path d="M7.2,19.964V17.928a.4.4,0,0,1,.4-.4H9.636a.4.4,0,0,1,.4.4v2.036a.4.4,0,0,1-.4.4H7.6A.4.4,0,0,1,7.2,19.964Z" fill="currentColor"/>
          <path d="M22.4,11.238V9.2a.4.4,0,0,1,.4-.4h2.036a.4.4,0,0,1,.4.4v2.036a.4.4,0,0,1-.4.4H22.8A.4.4,0,0,1,22.4,11.238Z" fill="currentColor"/>
          <path d="M22.4,15.6V13.564a.4.4,0,0,1,.4-.4h2.036a.4.4,0,0,1,.4.4V15.6a.4.4,0,0,1-.4.4H22.8A.4.4,0,0,1,22.4,15.6Z" fill="currentColor"/>
          <path d="M22.4,19.964V17.928a.4.4,0,0,1,.4-.4h2.036a.4.4,0,0,1,.4.4v2.036a.4.4,0,0,1-.4.4H22.8A.4.4,0,0,1,22.4,19.964Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-8 h-8 text-gray-400" style={{ left: '12%', top: '45%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M27.58,4.42a1,1,0,0,0-1.41,0L16,14.59,5.83,4.42A1,1,0,0,0,4.42,5.83L14.59,16,4.42,26.17a1,1,0,1,0,1.41,1.41L16,17.41,26.17,27.58a1,1,0,0,0,1.41-1.41L17.41,16,27.58,5.83A1,1,0,0,0,27.58,4.42Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-6 h-6 text-gray-400" style={{ left: '82%', top: '48%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm6.21,20.71L16,18.5l-6.21,4.21A1,1,0,0,1,8.5,21.29L14.71,17,8.5,12.71a1,1,0,0,1,1.29-1.42L16,15.5l6.21-4.21a1,1,0,0,1,1.29,1.42L17.29,17l6.21,4.29a1,1,0,0,1-1.29,1.42Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-8 h-8 text-gray-400" style={{ left: '6%', top: '55%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M2.585,17.413a1.999,1.999,0,0,1,0-2.826L14.587,2.585a1.999,1.999,0,0,1,2.826,0L29.415,14.587a1.999,1.999,0,0,1,0,2.826L17.413,29.415a1.999,1.999,0,0,1-2.826,0Z" fill="currentColor"/>
          <path d="M16,6.5A9.5,9.5,0,1,0,25.5,16,9.51,9.51,0,0,0,16,6.5Zm0,17A7.5,7.5,0,1,1,23.5,16,7.508,7.508,0,0,1,16,23.5Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-6 h-6 text-gray-400" style={{ left: '86%', top: '58%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M16,2.5C8.544,2.5,2.5,8.544,2.5,16S8.544,29.5,16,29.5,29.5,23.456,29.5,16,23.456,2.5,16,2.5Zm7.7,11.873c-.393.8-.98,1.415-1.793,1.877a5.53,5.53,0,0,1-2.7.693,5.53,5.53,0,0,1-2.7-.693c-.813-.462-1.4-1.077-1.793-1.877a4.5,4.5,0,0,1-.287-1.6,4.5,4.5,0,0,1,.287-1.6c.393-.8.98-1.415,1.793-1.877a5.53,5.53,0,0,1,2.7-.693,5.53,5.53,0,0,1,2.7.693c.813.462,1.4,1.077,1.793,1.877a4.5,4.5,0,0,1,.287,1.6A4.5,4.5,0,0,1,23.7,14.373Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-8 h-8 text-gray-400" style={{ left: '10%', top: '88%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M24.4,9.7V8.5a.5.5,0,0,0-.5-.5H8.1a.5.5,0,0,0-.5.5V9.7a.5.5,0,0,0,.5.5H23.9A.5.5,0,0,0,24.4,9.7Z" fill="currentColor"/>
          <path d="M24.4,15.7V14.5a.5.5,0,0,0-.5-.5H8.1a.5.5,0,0,0-.5.5v1.2a.5.5,0,0,0,.5.5H23.9A.5.5,0,0,0,24.4,15.7Z" fill="currentColor"/>
          <path d="M24.4,21.7V20.5a.5.5,0,0,0-.5-.5H8.1a.5.5,0,0,0-.5.5v1.2a.5.5,0,0,0,.5.5H23.9A.5.5,0,0,0,24.4,21.7Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-6 h-6 text-gray-400" style={{ left: '80%', top: '92%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M13.24,16.13,8.11,10.46A.5.5,0,0,1,8.46,9.7h2.85a.5.5,0,0,1,.35.14l3.59,3.71a.25.25,0,0,0,.35,0l3.59-3.71A.5.5,0,0,1,19.54,9.7h2.85a.5.5,0,0,1,.35.76L17.61,16.13a1,1,0,0,1-1.48,0Z" fill="currentColor"/>
          <path d="M18.76,15.87l5.13,5.67a.5.5,0,0,1-.35.76H20.69a.5.5,0,0,1-.35-.14l-3.59-3.71a.25.25,0,0,0-.35,0l-3.59,3.71a.5.5,0,0,1-.35.14H9.61a.5.5,0,0,1-.35-.76l5.13-5.67a1,1,0,0,1,1.48,0Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Coding Symbols */}
      <div className="absolute text-gray-500 text-2xl font-mono" style={{ left: '25%', top: '18%' }}>{ }</div>
      <div className="absolute text-gray-500 text-xl font-mono" style={{ left: '65%', top: '22%' }}>[ ]</div>
      <div className="absolute text-gray-500 text-2xl font-mono" style={{ left: '35%', top: '32%' }}>( )</div>
      <div className="absolute text-gray-500 text-xl font-mono" style={{ left: '55%', top: '35%' }}>&lt; &gt;</div>
      <div className="absolute text-gray-500 text-2xl font-mono" style={{ left: '45%', top: '42%' }}>;</div>
      <div className="absolute text-gray-500 text-xl font-mono" style={{ left: '25%', top: '52%' }}>:</div>
      <div className="absolute text-gray-500 text-2xl font-mono" style={{ left: '65%', top: '55%' }}>→</div>
      <div className="absolute text-gray-500 text-xl font-mono" style={{ left: '35%', top: '62%' }}>===</div>
      <div className="absolute text-gray-500 text-2xl font-mono" style={{ left: '55%', top: '68%' }}>!=</div>
      <div className="absolute text-gray-500 text-xl font-mono" style={{ left: '15%', top: '75%' }}>&&</div>
      <div className="absolute text-gray-500 text-2xl font-mono" style={{ left: '75%', top: '78%' }}>||</div>
      <div className="absolute text-gray-500 text-xl font-mono" style={{ left: '45%', top: '85%' }}>++</div>
      <div className="absolute text-gray-500 text-2xl font-mono" style={{ left: '25%', top: '92%' }}>--</div>
      <div className="absolute text-gray-500 text-xl font-mono" style={{ left: '65%', top: '88%' }}>?:</div>

      {/* Additional Tech Icons */}
      <div className="absolute w-5 h-5 text-gray-400" style={{ left: '40%', top: '15%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,25A11,11,0,1,1,27,16,11,11,0,0,1,16,27Z" fill="currentColor"/>
          <path d="M16,8a8,8,0,1,0,8,8A8,8,0,0,0,16,8Zm0,13a5,5,0,1,1,5-5A5,5,0,0,1,16,21Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-5 h-5 text-gray-400" style={{ left: '60%', top: '25%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M5.8,2A1.8,1.8,0,0,0,4,3.8V28.2A1.8,1.8,0,0,0,5.8,30H26.2A1.8,1.8,0,0,0,28,28.2V3.8A1.8,1.8,0,0,0,26.2,2ZM6,4H26V28H6Z" fill="currentColor"/>
          <path d="M8,8H24v2H8Z" fill="currentColor"/>
          <path d="M10,12H22v2H10Z" fill="currentColor"/>
          <path d="M10,16H20v2H10Z" fill="currentColor"/>
          <path d="M8,20H24v2H8Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-5 h-5 text-gray-400" style={{ left: '30%', top: '65%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M4,6H28a2,2,0,0,1,2,2V24a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V8A2,2,0,0,1,4,6ZM4,8V24H28V8Z" fill="currentColor"/>
          <path d="M6,10H26v2H6Z" fill="currentColor"/>
          <path d="M6,14H26v2H6Z" fill="currentColor"/>
          <path d="M6,18H26v2H6Z" fill="currentColor"/>
          <path d="M6,22H26v2H6Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-5 h-5 text-gray-400" style={{ left: '70%', top: '72%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M5.902,27.201,3.656,2h24.688l-2.249,25.197L15.985,30ZM24.126,5H7.874l1.755,19.683L15.985,26.8l6.356-2.117Z" fill="currentColor"/>
          <path d="M16,8H24l-.4,4H16v4h7.6l-.533,6L16,23.2V19.2l3.067-.8L19.2,17H16v4l-3.067-.8L12.8,17H16V13H8.4L8,9h8Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-5 h-5 text-gray-400" style={{ left: '20%', top: '82%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M5.902,27.201,3.656,2h24.688l-2.249,25.197L15.985,30ZM24.126,5H7.874l1.755,19.683L15.985,26.8l6.356-2.117Z" fill="currentColor"/>
          <path d="M16,13H8.4L8,9h8V5H24l-.4,4H16v4h7.6l-.533,6L16,23.2V19.2l3.067-.8L19.2,17H16Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute w-5 h-5 text-gray-400" style={{ left: '50%', top: '95%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-full h-full">
          <path d="M29.472,14.753,17.247,2.528a1.8,1.8,0,0,0-2.55,0L12.158,5.067l3.22,3.22a2.141,2.141,0,0,1,2.712,2.73l3.1,3.1a2.143,2.143,0,1,1-1.285,1.21l-2.895-2.895v7.617a2.141,2.141,0,1,1-1.764-.062V12.3a2.146,2.146,0,0,1-1.165-2.814L10.911,6.314,2.528,14.7a1.8,1.8,0,0,0,0,2.551L14.753,29.472a1.8,1.8,0,0,0,2.55,0L29.472,17.3a1.8,1.8,0,0,0,0-2.551Z" fill="currentColor"/>
        </svg>
      </div>
    </div>

    {/* Grid background extending behind header */}
    <div
      className="absolute inset-0 -top-20 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    />
    {/* Evenly spaced dashed grid lines that frame content without conflicting */}
    <div className="absolute inset-0 -top-20 pointer-events-none z-10">
      {/* Left vertical dashed line */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          left: '10%',
          background: 'repeating-linear-gradient(to bottom, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Right vertical dashed line */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          right: '10%',
          background: 'repeating-linear-gradient(to bottom, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Top horizontal dashed line - above content */}
      <div
        className="absolute h-px"
        style={{
          top: '20px',
          left: '10%',
          right: '10%',
          background: 'repeating-linear-gradient(to right, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Middle horizontal line - between announcement and headline */}
      <div
        className="absolute h-px"
        style={{
          top: '20%',
          left: '10%',
          right: '10%',
          background: 'repeating-linear-gradient(to right, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Bottom horizontal line - below buttons */}
      <div
        className="absolute h-px"
        style={{
          bottom: '20px',
          left: '10%',
          right: '10%',
          background: 'repeating-linear-gradient(to right, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />
    </div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-8 pt-6 pb-8 lg:pt-12 lg:pb-12">
        <div>
          <Feed queries={[blog.latestPostQuery]}>
            {/* biome-ignore lint/suspicious/useAwait: "Server Actions must be async" */}
            {async ([data]: [any]) => {
              'use server';

              return (
                <Button variant="secondary" size="sm" className="gap-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20 hover:from-orange-500/20 hover:to-orange-600/20 hover:border-orange-500/30 text-orange-400 hover:text-orange-300" asChild>
                  <Link href={`/blog/${data.blog.posts.item?._slug}`}>
                    {dictionary.web.home.hero.announcement}{' '}
                    <MoveRight className="h-4 w-4 text-orange-400" />
                  </Link>
                </Button>
              );
            }}
          </Feed>
        </div>
        <div className="flex flex-col gap-6 relative">
          {/* Natural flowing white gradient background extending behind header */}
          <div className="absolute inset-0 -top-32 bg-gradient-to-b from-white/8 via-white/8 to-transparent blur-3xl -z-10 scale-150" />
          <div className="absolute inset-0 -top-24 bg-gradient-radial from-white/8 via-white/8 to-transparent blur-2xl -z-10 scale-125" />
          <AnimatedTitle />
          <p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl relative z-10">
            Meet Cubent Coder, the autonomous AI coding assistant that lives in your editor. Generate code, debug issues, write documentation, and automate tasks with natural language commands.
          </p>
        </div>
        <div className="flex flex-row gap-4 mt-2">
          <Button size="lg" className="gap-4 bg-black border border-gray-800 text-white hover:bg-gray-900 rounded-full px-8 py-4 text-lg font-medium" asChild>
            <Link href="https://marketplace.visualstudio.com/items?itemName=cubent.cubent" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
              </svg>
              VS Code
            </Link>
          </Button>
          <Button size="lg" className="gap-4 bg-black border border-gray-800 text-white hover:bg-gray-900 rounded-full px-8 py-4 text-lg font-medium" asChild>
            <Link href="https://plugins.jetbrains.com/plugin/cubent" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 0v24h24V0H0zm3.723 3.111h5v1.834h-1.39v6.277h1.39v1.834h-5v-1.834h1.444V4.945H3.723V3.111zm11.055 0H17v1.834h-1.389v6.277H17v1.834h-2.222V3.111zm-8.334 8.944H9.61v1.833H6.444v-1.833z"/>
              </svg>
              JetBrains
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
