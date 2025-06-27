import { Hero } from "@/components/hero/hero";
import { Section } from "@/components/section";
import { TopLeftShiningLight, TopRightShiningLight } from "@/components/svg/hero";
import Image from "next/image";
import mainboard from "../../../images/mainboard.svg";

import { showBetaFeature } from '@repo/feature-flags';
import { getDictionary } from '@repo/internationalization';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';

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
      <TopRightShiningLight />
      <TopLeftShiningLight />
      <div className="relative w-full pt-6 overflow-hidden">
        <div className="container relative mx-auto">
          <Image
            src={mainboard}
            alt="Animated SVG showing computer circuits lighting up"
            className="absolute inset-x-0 flex  xl:hidden -z-10 scale-[2]"
            priority
          />
        </div>
        <div className="container relative flex flex-col mx-auto">
          <Section>
            <Hero />
          </Section>
        </div>
      </div>
    </>
  );
};

export default Home;
