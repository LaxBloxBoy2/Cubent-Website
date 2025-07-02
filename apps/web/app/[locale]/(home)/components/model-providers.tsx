import React from 'react';

export const ModelProviders = () => {
  return (
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-12">
          {/* Header */}
          <div className="flex flex-col gap-4 text-center max-w-4xl mx-auto">
            <h2 className="font-regular text-3xl tracking-tighter md:text-4xl">
              First-class support for every major model provider
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed tracking-tight">
              Connect with the AI models you trust. Cubent works seamlessly with all leading providers.
            </p>
          </div>

          {/* Model Provider Logos */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">

              {/* OpenAI */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/openai.png"
                    alt="OpenAI"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">OpenAI</span>
              </div>

              {/* Anthropic */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/anthropic.png"
                    alt="Anthropic"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">Anthropic</span>
              </div>

              {/* Google */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/gemini-color.png"
                    alt="Google Gemini"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">Google</span>
              </div>

              {/* Cohere */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/cohere-color.png"
                    alt="Cohere"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">Cohere</span>
              </div>

              {/* Mistral */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/mistral-color.png"
                    alt="Mistral"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">Mistral</span>
              </div>

              {/* OpenRouter */}
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/openrouter.png"
                    alt="OpenRouter"
                    className="w-10 h-10 grayscale opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-muted-foreground">OpenRouter</span>
              </div>

            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
