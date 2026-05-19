/* eslint-disable @next/next/no-img-element */
import { Container } from '../../lib/ui';
import type { GridBlock as GridBlockType } from '../../lib/types';
import block from './Block.module.css';
import styles from './GridBlock.module.css';

export function GridBlock({ block: b }: { block: GridBlockType }) {
  const colsClass = `cols-${b.columns ?? 3}` as const;
  return (
    <div className={block.block}>
      <Container width="wide">
        {b.heading && <h2 className={styles.heading}>{b.heading}</h2>}
        <div className={`${styles.grid} ${styles[colsClass]}`}>
          {b.items.map((item, i) => (
            <div key={i} className={styles.item}>
              {item.image && <img src={item.image} alt={item.title} className={styles.itemImage} />}
              <h3 className={styles.itemTitle}>{item.title}</h3>
              {item.body && <p className={styles.itemBody}>{item.body}</p>}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
