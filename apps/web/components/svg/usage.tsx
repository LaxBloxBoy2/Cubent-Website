import React from "react";

interface UsageProps {
  className?: string;
}

export const Usage: React.FC<UsageProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="usageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
        </linearGradient>
        <filter id="usageGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect
        width="300"
        height="200"
        fill="url(#usageGradient)"
        opacity="0.1"
        rx="8"
      />

      {/* Chart bars */}
      <rect x="40" y="120" width="20" height="60" fill="currentColor" opacity="0.6" rx="2" />
      <rect x="80" y="100" width="20" height="80" fill="currentColor" opacity="0.7" rx="2" />
      <rect x="120" y="80" width="20" height="100" fill="currentColor" opacity="0.8" rx="2" />
      <rect x="160" y="60" width="20" height="120" fill="currentColor" opacity="0.9" rx="2" />
      <rect x="200" y="90" width="20" height="90" fill="currentColor" opacity="0.7" rx="2" />
      <rect x="240" y="110" width="20" height="70" fill="currentColor" opacity="0.6" rx="2" />

      {/* Grid lines */}
      <line x1="20" y1="60" x2="280" y2="60" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <line x1="20" y1="100" x2="280" y2="100" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <line x1="20" y1="140" x2="280" y2="140" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <line x1="20" y1="180" x2="280" y2="180" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

      {/* Trend line */}
      <path
        d="M50 140 L90 120 L130 90 L170 70 L210 95 L250 125"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.8"
        filter="url(#usageGlow)"
      />

      {/* Data points */}
      <circle cx="50" cy="140" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="90" cy="120" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="130" cy="90" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="170" cy="70" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="210" cy="95" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="250" cy="125" r="3" fill="currentColor" opacity="0.9" />

      {/* Labels */}
      <text x="50" y="195" textAnchor="middle" className="text-xs fill-current opacity-60">Mon</text>
      <text x="90" y="195" textAnchor="middle" className="text-xs fill-current opacity-60">Tue</text>
      <text x="130" y="195" textAnchor="middle" className="text-xs fill-current opacity-60">Wed</text>
      <text x="170" y="195" textAnchor="middle" className="text-xs fill-current opacity-60">Thu</text>
      <text x="210" y="195" textAnchor="middle" className="text-xs fill-current opacity-60">Fri</text>
      <text x="250" y="195" textAnchor="middle" className="text-xs fill-current opacity-60">Sat</text>

      {/* Y-axis labels */}
      <text x="15" y="65" textAnchor="end" className="text-xs fill-current opacity-60">100k</text>
      <text x="15" y="105" textAnchor="end" className="text-xs fill-current opacity-60">50k</text>
      <text x="15" y="145" textAnchor="end" className="text-xs fill-current opacity-60">25k</text>
      <text x="15" y="185" textAnchor="end" className="text-xs fill-current opacity-60">0</text>

      {/* Title */}
      <text x="150" y="30" textAnchor="middle" className="text-sm font-medium fill-current opacity-80">
        API Usage Analytics
      </text>
    </svg>
  );
};

export const UsageSparkles: React.FC<UsageProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Large sparkle */}
      <path
        d="M12 2L13.09 8.26L19 7L13.09 15.74L12 22L10.91 15.74L5 17L10.91 8.26L12 2Z"
        fill="url(#sparkleGradient)"
        opacity="0.9"
      />

      {/* Small sparkles */}
      <circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.7" />
      <circle cx="18" cy="6" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="20" cy="16" r="1.5" fill="currentColor" opacity="0.8" />
      <circle cx="4" cy="18" r="1" fill="currentColor" opacity="0.5" />

      {/* Tiny sparkles */}
      <circle cx="8" cy="4" r="0.5" fill="currentColor" opacity="0.4" />
      <circle cx="16" cy="20" r="0.5" fill="currentColor" opacity="0.4" />
      <circle cx="3" cy="12" r="0.5" fill="currentColor" opacity="0.3" />
      <circle cx="21" cy="10" r="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
};
