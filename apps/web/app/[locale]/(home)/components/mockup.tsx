'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MoveRight, X } from 'lucide-react';
import { useState } from 'react';

// Feature data
const features = [
  {
    id: 1,
    title: "Context-aware code intelligence system",
    image: "/images/cubent-feature-1.png",
    alt: "Context Intelligence",
    description: "Cubent understands your entire codebase context, making intelligent suggestions that align with your project's architecture and patterns.",
    content: [
      "At the heart of modern software development lies the challenge of maintaining context across vast codebases. Cubent revolutionizes this experience by providing deep, contextual understanding of your entire project ecosystem. Our advanced AI doesn't just read your code—it comprehends the intricate relationships between components, understands your architectural decisions, and learns from your coding patterns.",

      "Unlike traditional code assistants that work in isolation, Cubent maintains a comprehensive map of your project's structure, dependencies, and design patterns. This enables it to make suggestions that aren't just syntactically correct, but architecturally sound and consistent with your existing codebase. Whether you're working on a microservices architecture, a monolithic application, or a complex distributed system, Cubent adapts to your specific context.",

      "The intelligence extends beyond simple code completion. Cubent analyzes cross-file dependencies, understands the impact of changes across your entire system, and can predict potential issues before they arise. This proactive approach to development helps teams maintain code quality while accelerating their development velocity, making it an indispensable tool for serious product development teams."
    ]
  },
  {
    id: 2,
    title: "Screenshot to code in seconds plus",
    image: "/images/cubent-feature-2.png",
    alt: "AI Screenshot Analysis",
    description: "Transform screenshots and designs into working code instantly. Cubent analyzes visual elements and generates pixel-perfect implementations.",
    content: [
      "In today's fast-paced development environment, the ability to rapidly prototype and implement designs is crucial for staying competitive. Cubent's revolutionary screenshot-to-code technology bridges the gap between design and implementation, allowing developers to transform visual mockups into functional code in seconds rather than hours.",

      "Our advanced computer vision algorithms analyze every pixel of your designs, understanding not just what elements are present, but how they should behave and interact. The system recognizes common UI patterns, understands responsive design principles, and generates code that follows modern best practices. Whether you're working with Figma designs, hand-drawn sketches, or competitor screenshots, Cubent can interpret and implement them accurately.",

      "The generated code isn't just a static representation—it's production-ready, accessible, and optimized for performance. Cubent automatically handles responsive breakpoints, generates semantic HTML, applies appropriate ARIA labels, and ensures cross-browser compatibility. This means you can go from concept to working prototype in minutes, allowing for rapid iteration and faster time-to-market for your products."
    ]
  },
  {
    id: 3,
    title: "Deep codebase understanding engine",
    image: "/images/cubent-feature-3.png",
    alt: "Smart Code Editing",
    description: "Experience intelligent code editing that understands your intent. Cubent provides contextual suggestions and automated improvements.",
    content: [
      "Perfect code isn't just about functionality—it's about maintainability, performance, and elegance. Cubent's intelligent editing capabilities go far beyond traditional autocomplete, offering a sophisticated understanding of code quality, performance implications, and best practices. Every suggestion is crafted with the goal of not just making your code work, but making it exceptional.",

      "The system continuously analyzes your code for potential improvements, from micro-optimizations that enhance performance to architectural suggestions that improve maintainability. Cubent understands the nuances of different programming languages, frameworks, and design patterns, allowing it to provide highly specific and relevant recommendations tailored to your technology stack and coding style.",

      "What sets Cubent apart is its ability to learn and adapt to your team's specific standards and preferences. It recognizes your coding conventions, understands your project's unique requirements, and evolves its suggestions to match your team's definition of perfect code. This results in a more consistent codebase, reduced technical debt, and a development experience that feels truly personalized and intelligent."
    ]
  }
];

export const Mockup = () => {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);

  return (
  <div className="w-full relative">
    {/* Grid background for GIF section */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    />
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="relative w-full max-w-7xl">
          <div className="relative overflow-hidden">
            <Image
              src="/images/Cubent.Dev.gif"
              alt="Cubent Editor Interface - Code editing with AI assistance"
              width={1200}
              height={800}
              className="w-full h-auto object-cover rounded-lg"
              priority
              unoptimized
            />
            {/* Soft glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-30 -z-10" />
          </div>
        </div>
      </div>
    </div>

    {/* Made for modern product teams section */}
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      {/* Top section - Title on left, description on right */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start mb-16 lg:mb-20 max-w-5xl mx-auto">
        {/* Left side - Title */}
        <div className="flex-1 max-w-md">
          <h2 className="text-4xl lg:text-5xl font-regular tracking-tighter text-white">
            AI-powered development that understands your code
          </h2>
        </div>

        {/* Right side - Description and link */}
        <div className="flex-1 max-w-lg">
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Cubent transforms how developers work by providing intelligent, context-aware assistance that learns from your codebase. From instant screenshot-to-code conversion to deep architectural understanding, we're building the future of software development.
          </p>
          <Link href="#" className="text-white hover:text-muted-foreground transition-colors inline-flex items-center gap-2">
            Make the switch <MoveRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Bottom section - Three feature cards in a row */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              onClick={() => setSelectedFeature(feature)}
              className={`group relative bg-[#1a1a1a] rounded-3xl overflow-hidden hover:bg-[#222222] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 cursor-pointer ${
                index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 pr-16">
                <h3 className="text-xl font-medium text-white mb-2 leading-tight break-words">
                  {feature.title}
                </h3>
              </div>
              <div className="absolute bottom-5 right-5 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/70 group-hover:bg-white/10 group-hover:text-white transition-all duration-300">
                <span className="text-2xl leading-none">+</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Database Explorer Section - Same background as community section */}
    <div className="w-full py-16 lg:py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-white/20">
      {/* Grid background - exact same as community section */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      {/* Background gradient effects - same as community */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/11 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto relative">
          {/* Vertical center dividing line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 transform -translate-x-1/2 hidden lg:block"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center group transition-all duration-500 grayscale hover:grayscale-0">
            {/* Left side - Content only */}
            <div className="space-y-8 pr-8 lg:pr-16">
              {/* MCP Tools label */}
              <div className="text-white/60 text-sm font-medium tracking-wider group-hover:text-orange-500 transition-colors duration-500">
                — MCP Tools
              </div>

              {/* Main heading */}
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-regular tracking-tight text-white leading-tight">
                  Integrate with the tools <span className="group-hover:text-orange-500 transition-colors duration-500">you already use</span>
                </h2>
                <p className="text-white/70 text-lg leading-relaxed max-w-md">
                  Cubent brings together your essential apps with MCP from GitHub to Notion — into one powerful interface. Discover, connect, and explore your data like never before.
                </p>
              </div>
            </div>

            {/* Right side - Database interface image */}
            <div className="hidden lg:block pl-8 lg:pl-16">
              <div className="relative">
                <img
                  src="/images/cubent-database-interface.png"
                  alt="Database interface showing table explorer and query editor"
                  className="w-full h-auto rounded-lg shadow-2xl transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Inverted MCP Tools Section - Image on left, content on right */}
    <div className="w-full py-16 lg:py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-white/20">
      {/* Grid background - same as above */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/11 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto relative">
          {/* Vertical center dividing line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 transform -translate-x-1/2 hidden lg:block"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center group transition-all duration-500 grayscale hover:grayscale-0">
            {/* Left side - Autocomplete interface image (inverted) */}
            <div className="hidden lg:block pr-8 lg:pr-16">
              <div className="relative">
                <img
                  src="/images/cubent-autocomplete-interface.png"
                  alt="Code editor showing intelligent autocomplete suggestions"
                  className="w-full h-auto rounded-lg shadow-2xl transition-all duration-500"
                />
              </div>
            </div>

            {/* Right side - Content (inverted) */}
            <div className="space-y-8 pl-8 lg:pl-16">
              {/* Autocomplete label */}
              <div className="text-white/60 text-sm font-medium tracking-wider group-hover:text-orange-500 transition-colors duration-500">
                — Autocomplete
              </div>

              {/* Main heading */}
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-regular tracking-tight text-white leading-tight">
                  Code smarter<br />
                  with <span className="group-hover:text-orange-500 transition-colors duration-500">context-aware autocomplete</span>
                </h2>
                <p className="text-white/70 text-lg leading-relaxed max-w-md">
                  MCP Tools helps you write faster and cleaner code with intelligent suggestions that adapt to your workflow — just start typing, and let the magic happen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal */}
    {selectedFeature && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="relative">
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
            >
              <X size={20} />
            </button>

            {/* Feature Image */}
            <div className="relative h-80 w-full overflow-hidden">
              <Image
                src={selectedFeature.image}
                alt={selectedFeature.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-8 max-h-[50vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              {selectedFeature.title}
            </h2>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {selectedFeature.description}
            </p>

            <div className="space-y-6">
              {selectedFeature.content.map((paragraph, index) => (
                <p key={index} className="text-gray-300 leading-relaxed text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm leading-relaxed">
                Experience the power of AI-driven development with Cubent's advanced features designed to accelerate your workflow and improve code quality. Join thousands of developers who have already transformed their development process with intelligent, context-aware coding assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};
