import { Button } from '@repo/design-system/components/ui/button';
import { Check, MoveRight, Star, Shield, Zap, Users, Database, Globe, GitBranch } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Enterprise = () => {
  // CSS keyframes for wave animations
  const waveStyles = `
    @keyframes wave1 {
      0%, 100% { transform: rotate(-5deg) scale(1.2) translateX(0px) translateY(0px); }
      25% { transform: rotate(-3deg) scale(1.25) translateX(10px) translateY(-5px); }
      50% { transform: rotate(-7deg) scale(1.15) translateX(-5px) translateY(10px); }
      75% { transform: rotate(-4deg) scale(1.3) translateX(15px) translateY(-8px); }
    }
    @keyframes wave2 {
      0%, 100% { transform: rotate(3deg) scale(1.1) translateX(0px) translateY(0px); }
      33% { transform: rotate(5deg) scale(1.2) translateX(-8px) translateY(12px); }
      66% { transform: rotate(1deg) scale(1.05) translateX(12px) translateY(-6px); }
    }
    @keyframes wave3 {
      0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
      50% { transform: translateX(-10px) translateY(15px) scale(1.1); }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: waveStyles }} />
  <div className="w-full relative overflow-hidden">
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

    {/* Hero Section */}
    <div className="w-full relative overflow-hidden -mt-20 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-8 pt-16 pb-8 lg:pt-24 lg:pb-12">
          <div className="flex flex-col gap-6">
            <h1 className="max-w-4xl mx-auto text-center font-regular text-4xl tracking-tighter md:text-6xl lg:text-7xl">
              Enterprise AI Agent for Code at Scale
            </h1>
            <p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
              Deploy a secure, self-hosted AI that accelerates your engineering teams. It collaborates natively within your workflows, learns from your codebase, and delivers production-ready solutions.
            </p>
          </div>
          
          {/* Key Features Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="bg-neutral-800/70 border border-neutral-600 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              Full-cycle automation
            </div>
            <div className="bg-neutral-800/70 border border-neutral-600 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              Company-specific customization
            </div>
            <div className="bg-neutral-800/70 border border-neutral-600 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              On-premise deployment
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg"
              asChild
            >
              <Link href="/contact">
                Book a demo <MoveRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Stats Section */}
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-8">
            AI is changing software development<br />
            — is your team ready?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">90%</div>
            <p className="text-muted-foreground">
              of enterprise software engineers will use AI code assistants by 2028 <span className="text-sm">(Gartner)</span>
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">69%</div>
            <p className="text-muted-foreground">
              of CxOs say they are shipping software at least 2× faster <span className="text-sm">(GitLab)</span>
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">82%</div>
            <p className="text-muted-foreground">
              of developers are currently using AI tools for code writing <span className="text-sm">(Statista)</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* AI Agent Features Section */}
    <div className="w-full py-20 lg:py-32 bg-neutral-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-4">
            AI Agent engineered for Enterprise software development
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-semibold">Understands your codebase & context</h3>
            </div>
            <p className="text-muted-foreground">
              Cubent deeply analyzes your company's repository, fetching relevant data for each task—ensuring smarter suggestions and more accurate automation.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Workspace', 'Codebase', 'Databases', 'Files', 'Documentation', 'Web', '...'].map((item) => (
                <span key={item} className="bg-neutral-800/50 text-white px-3 py-1 rounded text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <GitBranch className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-semibold">Integrates with developers' tools</h3>
            </div>
            <p className="text-muted-foreground">
              Connect with GitHub, GitLab, Docker, PostgreSQL, MySQL, and more—handling related operations autonomously, mimicking your workflow.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-semibold">Leverages the best AI models</h3>
            </div>
            <p className="text-muted-foreground">
              Choose from industry-leading LLMs—including Claude 4, GPT-4o, Grok, Gemini, DeepSeek, Mistral and more—or switch models to optimize performance.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="text-sm text-muted-foreground">Claude 3.7 Sonnet</span>
              <span className="text-sm text-muted-foreground">GPT-4o</span>
              <span className="text-sm text-muted-foreground">Grok</span>
              <span className="text-sm text-muted-foreground">Gemini</span>
              <span className="text-sm text-muted-foreground">DeepSeek</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-semibold">Fine-tuned for your company</h3>
            </div>
            <p className="text-muted-foreground">
              Train Cubent on your specific coding style and stack, improving accuracy over time—unlike generic AI models.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="bg-neutral-800/70 border-neutral-600 text-white hover:bg-neutral-700/70"
            asChild
          >
            <Link href="/contact">
              See Cubent in action
            </Link>
          </Button>
        </div>
      </div>
    </div>

    {/* Empower Engineers Section */}
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-4">
            Empower your engineers with Cubent Agent
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Technical leaders choose Cubent Agent to empower engineers to work faster, onboard quickly, and ship products without delays
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          <div className="text-center">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-500 font-bold text-lg">01</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Understands large codebases</h3>
            <p className="text-muted-foreground text-sm">
              No matter how complex your repositories are, Cubent Agent selects the right context to deliver accurate solutions.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-500 font-bold text-lg">02</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Continuously improves</h3>
            <p className="text-muted-foreground text-sm">
              Learns from each interaction and feedback with your developers, updating its memory and becoming smarter over time.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-500 font-bold text-lg">03</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Organizes experience into a knowledge base</h3>
            <p className="text-muted-foreground text-sm">
              Builds a shared memory from developers' interactions, speeding up collaboration across your team.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Get dedicated support from our team—available at every stage, from setup to fine-tuning and beyond.
          </p>
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            asChild
          >
            <Link href="/contact">
              Try Cubent today
            </Link>
          </Button>
        </div>
      </div>
    </div>

    {/* Gartner Recognition Section */}
    <div className="w-full py-20 lg:py-32 bg-neutral-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-6">
            The only Open-source AI Code Assistant for Enterprise recognized by Gartner
          </h2>
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-lg text-muted-foreground italic mb-4">
              "With Cubent, users can choose from a wide range of models both for cloud and self-hosted versions, allowing them to tailor the AI assistant to their specific needs, <strong>balancing performance, accuracy and computational requirements.</strong>"
            </blockquote>
            <cite className="text-orange-500 font-semibold">— Gartner</cite>
          </div>
        </div>
      </div>
    </div>

    {/* Deployment Options Section */}
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-4">
            Deploy AI agent on-premise, as SaaS, or on AWS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-neutral-900/30 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/30">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-semibold">On-Premise</h3>
            </div>
            <p className="text-muted-foreground">
              Complete privacy of your code and data, with LLMs fine-tuned for your specific stack.
            </p>
          </div>

          <div className="bg-neutral-900/30 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/30">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-semibold">SaaS</h3>
            </div>
            <p className="text-muted-foreground">
              Fast cloud-based setup, ready to scale with your team.
            </p>
          </div>

          <div className="bg-neutral-900/30 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/30">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-semibold">AWS</h3>
            </div>
            <p className="text-muted-foreground">
              Scalable and secure deployment in your Amazon Web Services Infrastructure.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-6 max-w-3xl mx-auto">
            <p className="text-orange-400 font-semibold mb-2">
              Cubent sees 1.5x Price Performance as the First AI Coding Assistant on AWS Inferentia2
            </p>
            <Button
              variant="outline"
              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              asChild
            >
              <Link href="#" target="_blank" rel="noopener noreferrer">
                Read the Case Study
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>



    {/* Final CTA Section */}
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-regular tracking-tighter md:text-4xl mb-6">
            Empower your developers with AI Agent
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Bring your engineers an AI teammate that deeply understands your codebase, integrates into your workflows, and accelerates development—while keeping your data fully secure and under your control.
          </p>
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg"
            asChild
          >
            <Link href="/contact">
              Book a Demo <MoveRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
    </>
  );
};

export default Enterprise;
