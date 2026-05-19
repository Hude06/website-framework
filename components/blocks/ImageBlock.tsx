/* eslint-disable @next/next/no-img-element */
import { Container } from '../../lib/ui';
import type { ImageBlock as ImageBlockType } from '../../lib/types';
import block from './Block.module.css';
import styles from './ImageBlock.module.css';

export function ImageBlock({ block: b }: { block: ImageBlockType }) {
  if (!b.src) return null;
  return (
    <div className={block.block}>
      <Container width={b.width ?? 'default'}>
        <figure>
          <img src={b.src} alt={b.alt} className={styles.image} />
          {b.caption && <figcaption className={styles.caption}>{b.caption}</figcaption>}
        </figure>
      </Container>
    </div>
  );
}
