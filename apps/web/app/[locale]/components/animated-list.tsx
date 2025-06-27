"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@repo/design-system/lib/utils';

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function AnimatedList({ 
  children, 
  className, 
  delay = 1000,
  staggerDelay = 800 
}: AnimatedListProps) {
  const [visibleItems, setVisibleItems] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleItems(prev => {
          if (prev >= children.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, staggerDelay);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, children.length, delay, staggerDelay]);

  // Reset animation when children change
  useEffect(() => {
    setVisibleItems(0);
    setIsVisible(false);
  }, [children.length]);

  return (
    <div ref={containerRef} className={cn("space-y-2", className)}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-500 ease-out",
            index < visibleItems
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95"
          )}
          style={{
            transitionDelay: index < visibleItems ? `${index * 100}ms` : '0ms'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
