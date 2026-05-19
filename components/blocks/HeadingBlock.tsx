import { Container, Heading } from '../../lib/ui';
import type { HeadingBlock as HeadingBlockType } from '../../lib/types';
import block from './Block.module.css';

export function HeadingBlock({ block: b }: { block: HeadingBlockType }) {
  return (
    <div className={block['block-tight']}>
      <Container width="default">
        <Heading
          level={b.level ?? 2}
          size={b.size}
          tone={b.tone}
          align={b.align}
        >
          {b.text}
        </Heading>
      </Container>
    </div>
  );
}
