'use client';

import { useEffect, useState } from 'react';

const words = ['generate', 'debug', 'explain', 'optimize'];

export const AnimatedTitle = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 300); // Half of the transition duration
    }, 3500); // Change word every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="max-w-4xl text-center font-regular text-6xl tracking-tighter md:text-7xl relative z-10">
      AI agent that can{' '}
      <span
        className={`inline-block transition-all duration-500 ease-in-out ${
          isVisible
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform -translate-y-2'
        }`}
        style={{
          background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          minWidth: '200px',
          display: 'inline-block',
          textAlign: 'left'
        }}
      >
        {words[currentWordIndex]},
      </span>{' '}
      so you can ship smarter.
    </h1>
  );
};
