"use client";
import { SectionTitle } from "@/components/section";
import { CalendarDays, ChevronRight } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { PrimaryButton, SecondaryButton } from "./button";

export const CTA: React.FC = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="relative pb-40 pt-14 ">
        <Highlights className="absolute inset-x-0 w-full mx-auto pointer-events-none -bottom-80 max-sm:w-8" />
        <SectionTitle
          align="center"
          title={
            <>
              Protect your API.
              <br /> Start today.
            </>
          }
        >
          <div className="flex flex-col items-center justify-center gap-6 mt-2 sm:mt-5 sm:flex-row">
            <Link
              target="_blank"
              href="https://cal.com/team/unkey/user-interview?utm_source=banner&utm_campaign=oss"
            >
              <SecondaryButton label="Chat with us" IconRight={CalendarDays} />
            </Link>
            <Link
              href="https://app.unkey.com"
            >
              <PrimaryButton shiny label="Start Now" IconRight={ChevronRight} />
            </Link>
          </div>
        </SectionTitle>
        <div className="mt-8 sm:mt-10 text-balance">
          <p className="w-full mx-auto text-sm leading-6 text-center text-white/60 max-w-[500px]">
            150,000 requests per month. No CC required.
          </p>
        </div>
      </div>
    </div>
  );
};

const Highlights: React.FC<{ className: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      width="944"
      height="1033"
      viewBox="0 0 944 1033"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.3">
        <g style={{ mixBlendMode: "lighten" }} filter="url(#filter0_f_2076_3208)">
          <ellipse
            cx="574.307"
            cy="568.208"
            rx="32.7783"
            ry="293.346"
            transform="rotate(-164.946 574.307 568.208)"
            fill="url(#paint0_linear_2076_3208)"
            fillOpacity="0.5"
          />
        </g>
        <g style={{ mixBlendMode: "color-dodge" }} filter="url(#filter1_f_2076_3208)">
          <ellipse
            cx="468.5"
            cy="589.25"
            rx="26.5"
            ry="293.25"
            transform="rotate(180 468.5 589.25)"
            fill="url(#paint1_linear_2076_3208)"
            fillOpacity="0.5"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_2076_3208"
          x="402.782"
          y="195.799"
          width="343.05"
          height="744.818"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="44.5" result="effect1_foregroundBlur_2076_3208" />
        </filter>
        <filter
          id="filter1_f_2076_3208"
          x="353"
          y="207"
          width="231"
          height="764.5"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="44.5" result="effect1_foregroundBlur_2076_3208" />
        </filter>
        <linearGradient
          id="paint0_linear_2076_3208"
          x1="574.307"
          y1="274.862"
          x2="574.307"
          y2="861.554"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2076_3208"
          x1="468.5"
          y1="296"
          x2="468.5"
          y2="882.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
