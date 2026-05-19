import { Container, Button } from '../../lib/ui';
import type { ButtonBlock as ButtonBlockType } from '../../lib/types';
import block from './Block.module.css';

const alignClass = {
  left: block.alignLeft,
  center: block.alignCenter,
  right: block.alignRight,
} as const;

export function ButtonBlock({ block: b }: { block: ButtonBlockType }) {
  return (
    <div className={block['block-tight']}>
      <Container width="default">
        <div className={alignClass[b.align ?? 'left']}>
          <Button variant={b.variant ?? 'primary'} size={b.size ?? 'md'} href={b.href}>
            {b.label}
          </Button>
        </div>
      </Container>
    </div>
  );
}
