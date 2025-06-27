import React from "react";

interface OssChipProps {
  className?: string;
}

export const OssChip: React.FC<OssChipProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background chip */}
      <rect
        x="10"
        y="20"
        width="180"
        height="60"
        rx="30"
        fill="url(#ossGradient)"
        filter="url(#glow)"
        opacity="0.7"
      />
      
      {/* Circuit lines */}
      <path
        d="M30 50 L50 50 L50 30 L80 30 L80 50 L120 50 L120 70 L170 70"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      
      {/* Connection points */}
      <circle cx="30" cy="50" r="3" fill="currentColor" opacity="0.8" />
      <circle cx="80" cy="30" r="3" fill="currentColor" opacity="0.8" />
      <circle cx="120" cy="50" r="3" fill="currentColor" opacity="0.8" />
      <circle cx="170" cy="70" r="3" fill="currentColor" opacity="0.8" />
      
      {/* Decorative elements */}
      <rect x="60" y="45" width="10" height="10" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="140" y="35" width="8" height="8" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
};
