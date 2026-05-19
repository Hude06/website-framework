import { NextResponse } from 'next/server';
import { listPages, loadPage } from '@/lib/content';
import { writePage, validateSlug, generateBlockId } from '@/lib/admin';
import type { ApiResponse, FrameworkBlock, PageContent } from '@/lib/types';

export async function GET() {
  const pages = listPages();
  const pageList = pages.map((slug) => {
    const page = loadPage(slug);
    return { slug, title: page.title };
  });

  return NextResponse.json<ApiResponse<{ slug: string; title: string }[]>>({
    success: true,
    data: pageList,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!slug || !validateSlug(slug)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Slug must be lowercase alphanumeric with hyphens' },
        { status: 400 }
      );
    }

    const existing = listPages();
    if (existing.includes(slug)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'A page with this slug already exists' },
        { status: 409 }
      );
    }

    const starterBlocks: FrameworkBlock[] = [
      { id: generateBlockId(slug, 0), type: 'heading', text: title, level: 1, size: 'display' },
      { id: generateBlockId(slug, 1), type: 'text', body: 'Start editing this page…' },
    ];
    const page: PageContent = { title, slug, blocks: starterBlocks };

    writePage(page);

    return NextResponse.json<ApiResponse<PageContent>>({
      success: true,
      data: page,
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create page';
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
