import { env } from '@/env';
import { Button } from '@repo/design-system/components/ui/button';
import { Check, MoveRight, Key, Star } from 'lucide-react';
import Link from 'next/link';

const Pricing = () => (
  <div className="w-full relative overflow-hidden py-8 lg:py-16">
    {/* Grid background pattern */}
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

    {/* Orange ambient glow effects */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/8 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/3 rounded-full blur-2xl" />
    </div>

    <div className="container mx-auto relative z-10">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <h1 className="max-w-4xl text-center font-regular text-4xl tracking-tighter md:text-5xl">
            Simple pricing for powerful AI
          </h1>
          <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
            Start coding with AI assistance for free, then scale as your projects grow
          </p>

          {/* Early Access Message */}
          <div className="mt-3 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-orange-600/5 rounded-md backdrop-blur-sm">
            <p className="text-sm text-white text-center">
              🚀 Early Access: Currently offering BYAK Plan only as we perfect the experience
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="w-full max-w-6xl pt-8">
          <div className="relative">
            <div className="flex flex-col lg:flex-row bg-gray-900/30 backdrop-blur-sm rounded-xl overflow-hidden">
              {/* BYAK Plan */}
              <div className="relative flex-1 bg-gradient-to-br from-orange-500/5 to-orange-600/10">
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-orange-500 text-white px-3 py-1.5 rounded text-xs font-medium">
                    Early Access
                  </div>
                </div>
                <div className="p-8 pt-12 h-full flex flex-col text-left">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">BYAK</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Perfect for passion projects & simple websites.
                  </p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-4" asChild>
                    <Link href={env.NEXT_PUBLIC_APP_URL}>
                      Start for Free
                    </Link>
                  </Button>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">$5</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                  <div className="text-xs text-orange-500 mt-1">
                    7-day free trial included
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-3">Get started with:</p>
                </div>

                <ul className="space-y-2 flex-grow text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>VS Code extension with full AI coding assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Infinite messages & conversations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Use your own API keys (OpenAI, Anthropic, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Chat Mode & Agent Mode with tool calls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Terminal integration & custom modes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Access to 23+ AI models</span>
                  </li>
                </ul>
              </div>
            </div>

              {/* Pro Plan */}
              <div className="relative flex-1 border-l border-gray-700/30 bg-gradient-to-b from-neutral-800/70 to-black/50">
                <div className="p-8 pt-12 h-full flex flex-col text-left">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">PRO</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      For production applications with the power to scale.
                    </p>
                    <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white mb-4" disabled>
                      Coming Soon
                    </Button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-400">-</span>
                      <span className="text-sm text-gray-400">/ month</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-3">Everything in BYAK, plus:</p>
                  </div>

                  <ul className="space-y-2 flex-grow text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Generous Cubent Units allocation (no API keys needed)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Advanced code generation & refactoring tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Enhanced debugging & error analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Priority support & faster response times</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Team Plan */}
              <div className="relative flex-1 border-l border-gray-700/30 bg-gradient-to-b from-neutral-800/70 to-black/50">
                <div className="p-8 pt-12 h-full flex flex-col text-left">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">TEAM</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      SSO, control over backups, and industry certifications.
                    </p>
                    <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white mb-4" disabled>
                      Coming Soon
                    </Button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-400">-</span>
                      <span className="text-sm text-gray-400">/ month</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-3">Everything in the Pro Plan, plus:</p>
                  </div>

                  <ul className="space-y-2 flex-grow text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Team workspace & shared configurations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Code review assistance & team insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Advanced security & compliance features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Priority email support & training</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="relative flex-1 border-l border-gray-700/30 bg-gradient-to-b from-neutral-800/70 to-black/50">
                <div className="p-8 pt-12 h-full flex flex-col text-left">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">ENTERPRISE</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      For large-scale applications running Internet-scale workloads.
                    </p>
                    <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white mb-4" disabled>
                      Coming Soon
                    </Button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-400">Custom</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-3">Everything in Team, plus:</p>
                  </div>

                  <ul className="space-y-2 flex-grow text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Custom AI model integrations & fine-tuning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">On-premise deployment & air-gapped solutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">Dedicated account manager & SLA guarantees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">24/7 premium support & custom training</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by developers worldwide */}
        <div className="w-full max-w-4xl pt-16 text-center">
          <p className="text-sm text-muted-foreground mb-8">
            Trusted by developers worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-muted-foreground">10,000+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-2xl font-bold text-muted-foreground">50+</div>
            <div className="text-sm text-muted-foreground">Countries</div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-2xl font-bold text-muted-foreground">23+</div>
            <div className="text-sm text-muted-foreground">AI Models</div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="w-full max-w-6xl pt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 md:text-4xl">Understanding Cubent Units</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cubent Units provide a unified way to measure AI usage across different models
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="relative">
              <div className="border border-border bg-background/50 backdrop-blur-sm rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Star className="h-4 w-4 text-orange-500" />
                  </div>
                  How Units Work
                </h3>
                <ul className="space-y-4 text-muted-foreground text-left">
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Lower cost models (like Gemini 2.5 Flash) use fewer units</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Premium models (like Claude 3.7 Sonnet Thinking) use more units</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Thinking models use additional units for reasoning capabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Image processing may use additional units depending on the model</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="border border-orange-500/30 bg-background/50 backdrop-blur-sm rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Key className="h-4 w-4 text-orange-500" />
                  </div>
                  BYAK Advantage
                </h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Key className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>No additional charges from Cubent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Key className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Direct billing from AI providers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Key className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Access to latest models as they're released</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Key className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                    <span>Full control over usage and costs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">What happens when I run out of Cubent Units?</h3>
              <p className="text-muted-foreground">
                You can upgrade your plan, wait for the monthly reset, or switch to BYAK models with your own API keys.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I mix built-in and BYAK models?</h3>
              <p className="text-muted-foreground">
                Yes! You can use both built-in models (with Cubent Units) and BYAK models (with your API keys) in the same workspace.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Are there any usage limits?</h3>
              <p className="text-muted-foreground">
                Each plan has monthly Cubent Unit allocations. Enterprise plans can have custom limits based on your needs.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center pt-16">
            <h2 className="text-3xl font-bold mb-4">Ready to supercharge your coding with AI?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Choose your plan and start building better software faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
                <Link href={env.NEXT_PUBLIC_APP_URL}>
                  Start with BYAK <MoveRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={env.NEXT_PUBLIC_DOCS_URL}>
                  View Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Pricing;
