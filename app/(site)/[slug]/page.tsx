import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadPage, listPages } from '@/lib/content';
import { BlockRenderer, frameworkBlocks } from '@/components/BlockRenderer';
import { clientBlocks } from '@client/registry';

const blockRegistry = { ...frameworkBlocks, ...clientBlocks };

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return listPages()
    .filter((slug) => slug !== 'home')
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = loadPage(slug);
    return { title: page.title };
  } catch {
    return { title: 'Not Found' };
  }
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  let page;
  try {
    page = loadPage(slug);
  } catch {
    notFound();
  }
  return <BlockRenderer blocks={page.blocks} registry={blockRegistry} />;
}
