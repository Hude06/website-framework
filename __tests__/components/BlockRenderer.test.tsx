import { render, screen } from '@testing-library/react';
import { BlockRenderer } from '@/components/BlockRenderer';
import type { FrameworkBlock } from '@/lib/types';
type Block = FrameworkBlock;

describe('BlockRenderer', () => {
  it('renders a heading block', () => {
    const blocks: Block[] = [
      { id: 'h1', type: 'heading', text: 'Test Heading' },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole('heading', { name: 'Test Heading' })).toBeInTheDocument();
  });

  it('renders a text block, splitting paragraphs on blank lines', () => {
    const blocks: Block[] = [
      { id: 't1', type: 'text', body: 'First paragraph.\n\nSecond paragraph.' },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
  });

  it('renders an image block', () => {
    const blocks: Block[] = [
      { id: 'img1', type: 'image', src: '/test.jpg', alt: 'Test' },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole('img', { name: 'Test' })).toHaveAttribute('src', '/test.jpg');
  });

  it('renders a button block as a link when href is set', () => {
    const blocks: Block[] = [
      { id: 'b1', type: 'button', label: 'Click me', href: '/somewhere' },
    ];
    render(<BlockRenderer blocks={blocks} />);
    expect(screen.getByRole('link', { name: 'Click me' })).toHaveAttribute('href', '/somewhere');
  });

  it('skips unknown block types without crashing', () => {
    const blocks = [
      { id: 'u1', type: 'unknown', text: 'Nope' },
    ] as unknown as Block[];
    const { container } = render(<BlockRenderer blocks={blocks} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders empty for no blocks', () => {
    const { container } = render(<BlockRenderer blocks={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
