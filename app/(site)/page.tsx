import { notFound } from 'next/navigation';
import type { PageContent } from '@/lib/types';
import { loadPage } from '@/lib/content';
import { BlockRenderer, frameworkBlocks } from '@/components/BlockRenderer';
import { clientBlocks } from '@client/registry';

const blockRegistry = { ...frameworkBlocks, ...clientBlocks };

export default async function HomePage() {
  let page: PageContent;
  try {
    page = loadPage('home');
  } catch {
    notFound();
  }
  return <BlockRenderer blocks={page.blocks} registry={blockRegistry} />;
}
