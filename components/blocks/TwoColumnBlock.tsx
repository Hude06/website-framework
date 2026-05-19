/* eslint-disable @next/next/no-img-element */
import { Container, Button } from '../../lib/ui';
import type { TwoColumnBlock as TwoColumnBlockType, ColumnSide } from '../../lib/types';
import block from './Block.module.css';
import styles from './TwoColumnBlock.module.css';

function Side({ side }: { side: ColumnSide }) {
  return (
    <div className={styles.col}>
      {side.image && <img src={side.image} alt={side.title ?? ''} className={styles.image} />}
      {side.title && <h2 className={styles.title}>{side.title}</h2>}
      {side.body && <p className={styles.body}>{side.body}</p>}
      {side.button && (
        <div className={styles.buttonRow}>
          <Button variant={side.button.variant ?? 'primary'} href={side.button.href}>
            {side.button.label}
          </Button>
        </div>
      )}
    </div>
  );
}

export function TwoColumnBlock({ block: b }: { block: TwoColumnBlockType }) {
  const ratioClass = `ratio-${b.ratio ?? '50-50'}` as const;
  return (
    <div className={block.block}>
      <Container width="wide">
        <div className={`${styles.grid} ${styles[ratioClass]}`}>
          <Side side={b.left} />
          <Side side={b.right} />
        </div>
      </Container>
    </div>
  );
}
