import { Sidebar } from '@/components/sidebar';
import { legal } from '@repo/cms';
import { Body } from '@repo/cms/components/body';
import { Feed } from '@repo/cms/components/feed';
import { TableOfContents } from '@repo/cms/components/toc';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type LegalPageProperties = {
  readonly params: Promise<{
    slug: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: LegalPageProperties): Promise<Metadata> => {
  const { slug } = await params;
  const post = await legal.getPost(slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post._title,
    description: post.description,
  });
};

export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  const posts = await legal.getPosts();

  return posts.map(({ _slug }) => ({ slug: _slug }));
};

const LegalPage = async ({ params }: LegalPageProperties) => {
  const { slug } = await params;

  return (
    <Feed queries={[legal.postQuery(slug)]}>
      {/* biome-ignore lint/suspicious/useAwait: "Server Actions must be async" */}
      {async ([data]) => {
        'use server';

        const page = data.legalPages.item;

        if (!page) {
          notFound();
        }

        return (
          <div className="min-h-screen bg-gradient-to-b from-orange-950/10 to-transparent">
            <div className="container mx-auto max-w-6xl py-16 px-4">
              <div className="flex flex-col items-start gap-8 lg:flex-row">
              <div className="flex-1 max-w-none lg:max-w-3xl mx-auto lg:mx-0">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <Body content={page.body.json.content} />
                </div>
              </div>
              <div className="sticky top-24 hidden shrink-0 lg:block lg:w-64">
                <Sidebar
                  toc={<TableOfContents data={page.body.json.toc} />}
                  readingTime={`${page.body.readingTime} min read`}
                  date={new Date()}
                />
              </div>
            </div>
            </div>
          </div>
        );
      }}
    </Feed>
  );
};

export default LegalPage;
