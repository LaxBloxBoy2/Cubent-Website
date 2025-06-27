import React from "react";

export interface LangIconProps {
  className?: string;
}

export const CurlIcon: React.FC<LangIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12L12 17L22 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ElixirIcon: React.FC<LangIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C12 2 8 6 8 12C8 16.4183 10.2386 18 12 18C13.7614 18 16 16.4183 16 12C16 6 12 2 12 2Z"
      fill="currentColor"
    />
    <path
      d="M12 18C12 18 16 14 16 8C16 3.58172 13.7614 2 12 2C10.2386 2 8 3.58172 8 8C8 14 12 18 12 18Z"
      fill="currentColor"
      opacity="0.6"
    />
  </svg>
);

export const GoIcon: React.FC<LangIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12H21M12 3V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const JSIcon: React.FC<LangIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="2"
      fill="currentColor"
      opacity="0.1"
    />
    <path
      d="M16 16C16 17.1046 15.1046 18 14 18C12.8954 18 12 17.1046 12 16V8H14V16Z"
      fill="currentColor"
    />
    <path
      d="M8 14C8 15.1046 8.89543 16 10 16C11.1046 16 12 15.1046 12 14H10C10 14.5523 9.55228 15 9 15C8.44772 15 8 14.5523 8 14V10C8 9.44772 8.44772 9 9 9C9.55228 9 10 9.44772 10 10H12C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10V14Z"
      fill="currentColor"
    />
  </svg>
);

export const NodeIcon: React.FC<LangIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L22 7V17L12 22L2 17V7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 22V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 7L12 12L2 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PHPIcon: React.FC<LangIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="6"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M6 10H8C9.10457 10 10 10.8954 10 12C10 13.1046 9.10457 14 8 14H6V16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M14 8V16M14 12H16C17.1046 12 18 11.1046 18 10C18 8.89543 17.1046 8 16 8H14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PythonIcon: React.FC<LangIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C14.2091 2 16 3.79086 16 6V10H8V12H18C20.2091 12 22 13.7909 22 16C22 18.2091 20.2091 20 18 20H16V18C16 15.7909 14.2091 14 12 14H8C5.79086 14 4 12.2091 4 10V6C4 3.79086 5.79086 2 8 2H12Z"
      fill="currentColor"
      opacity="0.6"
    />
    <circle cx="10" cy="6" r="1" fill="currentColor" />
    <circle cx="14" cy="18" r="1" fill="currentColor" />
  </svg>
);

export const RustIcon: React.FC<LangIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const TSIcon: React.FC<LangIconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="2"
      fill="currentColor"
      opacity="0.1"
    />
    <path
      d="M8 8H16M12 8V16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 12H18C19.1046 12 20 12.8954 20 14C20 15.1046 19.1046 16 18 16H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
