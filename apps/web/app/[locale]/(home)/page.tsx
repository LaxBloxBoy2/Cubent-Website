import { showBetaFeature } from '@repo/feature-flags';
import { getDictionary } from '@repo/internationalization';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { Cases } from './components/cases';
import { CTA } from './components/cta';
import { FAQ } from './components/faq';
import { Features } from './components/features';
import { Hero } from './components/hero';
import { Mockup } from './components/mockup';
import { Stats } from './components/stats';
import { Testimonials } from './components/testimonials';
import { CubentBento } from '../components/cubent-bento';

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.home.meta);
};

const Home = async ({ params }: HomeProps) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
      <Hero dictionary={dictionary} />
      <Mockup />
      <div className="w-full py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 mb-12">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="max-w-2xl font-regular text-3xl tracking-tighter md:text-5xl">
                Powerful Extension Features
              </h2>
              <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed tracking-tight">
                Experience the full power of Cubent's AI-powered coding assistant
              </p>
            </div>
          </div>
          <CubentBento />
        </div>
      </div>
      <Cases dictionary={dictionary} />
      <Features dictionary={dictionary} />
      <Stats dictionary={dictionary} />
      <Testimonials dictionary={dictionary} />
      <FAQ dictionary={dictionary} />
      <CTA dictionary={dictionary} />
    </>
  );
};

export default Home;
