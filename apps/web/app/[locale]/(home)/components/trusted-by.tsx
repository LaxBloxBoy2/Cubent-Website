'use client';

type TrustedByProps = {
  dictionary: any;
};

export const TrustedBy = ({ dictionary }: TrustedByProps) => (
  <div className="w-full relative overflow-hidden py-20 lg:py-32">
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

    {/* Grid lines with more transparency */}
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Left vertical dashed line */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          left: '10%',
          background: 'repeating-linear-gradient(to bottom, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Right vertical dashed line */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          right: '10%',
          background: 'repeating-linear-gradient(to bottom, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Top horizontal dashed line */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          top: '92px',
          background: 'repeating-linear-gradient(to right, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />

      {/* Bottom horizontal dashed line */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          bottom: '92px',
          background: 'repeating-linear-gradient(to right, rgba(62, 62, 62, 0.3) 0 5px, transparent 5px 11px)'
        }}
      />
    </div>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="flex flex-col items-center justify-center gap-12">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="font-regular text-3xl tracking-tighter md:text-4xl">
            Trusted by developers worldwide
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed tracking-tight">
            Join thousands of developers who rely on Cubent to enhance their coding workflow
          </p>
        </div>

        {/* Company logos grid */}
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60 hover:opacity-80 transition-opacity">
            {/* Notion Logo */}
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
              </svg>
              <span className="text-xs text-muted-foreground font-medium">Notion</span>
            </div>

            {/* Figma Logo */}
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148z"/>
                <path d="M12.764 24c-2.516 0-4.563-2.036-4.563-4.539s2.047-4.539 4.563-4.539 4.564 2.036 4.564 4.539S15.28 24 12.764 24zm0-7.588a3.023 3.023 0 0 0-3.093 3.049c0 1.691 1.387 3.068 3.093 3.068s3.093-1.377 3.093-3.068-1.387-3.049-3.093-3.049z"/>
              </svg>
              <span className="text-xs text-muted-foreground font-medium">Figma</span>
            </div>

            {/* Discord Logo */}
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
              </svg>
              <span className="text-xs text-muted-foreground font-medium">Discord</span>
            </div>

            {/* Slack Logo */}
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
              </svg>
              <span className="text-xs text-muted-foreground font-medium">Slack</span>
            </div>

            {/* Spotify Logo */}
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span className="text-xs text-muted-foreground font-medium">Spotify</span>
            </div>

            {/* Dropbox Logo */}
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2L12 6.5 6 11 0 6.5 6 2zm6 4.5L18 2l6 4.5L18 11l-6-4.5zM0 13.5L6 9l6 4.5L6 18l-6-4.5zm18-4.5l6 4.5L18 18l-6-4.5L18 9zM6 20.5l6-4.5 6 4.5L12 25l-6-4.5z"/>
              </svg>
              <span className="text-xs text-muted-foreground font-medium">Dropbox</span>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="w-full max-w-2xl -mt-8">
          <div className="grid grid-cols-3 gap-0 text-center rounded-lg overflow-hidden">
            <div className="flex flex-col gap-1 py-4 px-3">
              <div className="text-2xl font-bold tracking-tight" style={{ color: '#888888' }}>2.5k</div>
              <div className="text-xs" style={{ color: '#999999' }}>developers</div>
            </div>
            <div className="flex flex-col gap-1 py-4 px-3">
              <div className="text-2xl font-bold tracking-tight" style={{ color: '#888888' }}>2.5M+</div>
              <div className="text-xs" style={{ color: '#999999' }}>Lines of Code</div>
            </div>
            <div className="flex flex-col gap-1 py-4 px-3">
              <div className="text-2xl font-bold tracking-tight" style={{ color: '#888888' }}>99.9%</div>
              <div className="text-xs" style={{ color: '#999999' }}>Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
