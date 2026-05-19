import { Container } from '../../lib/ui';
import type { SectionBlock as SectionBlockType } from '../../lib/types';
import styles from './SectionBlock.module.css';

export function SectionBlock({ block: b }: { block: SectionBlockType }) {
  const bg = `bg-${b.background ?? 'default'}` as const;
  const pad = `padding-${b.padding ?? 'md'}` as const;
  return (
    <section
      id={b.anchor}
      className={`${styles.section} ${styles[bg]} ${styles[pad]}`}
    >
      <Container width="wide">
        {b.heading && <h2 className={styles.heading}>{b.heading}</h2>}
        {b.body && <p className={styles.body}>{b.body}</p>}
      </Container>
    </section>
  );
}
