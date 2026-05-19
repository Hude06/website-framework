/* eslint-disable @next/next/no-img-element */
import { Container } from '../../lib/ui';
import type { QuoteBlock as QuoteBlockType } from '../../lib/types';
import block from './Block.module.css';
import styles from './QuoteBlock.module.css';

export function QuoteBlock({ block: b }: { block: QuoteBlockType }) {
  return (
    <div className={block.block}>
      <Container width="default">
        <figure className={styles.figure}>
          <blockquote className={styles.quote}>{b.quote}</blockquote>
          {(b.author || b.image) && (
            <figcaption className={styles.attribution}>
              {b.image && <img src={b.image} alt={b.author ?? ''} className={styles.avatar} />}
              {b.author && (
                <span>
                  <span className={styles.author}>{b.author}</span>
                  {b.role && <span className={styles.role}>· {b.role}</span>}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      </Container>
    </div>
  );
}
