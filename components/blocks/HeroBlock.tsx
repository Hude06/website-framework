/* eslint-disable @next/next/no-img-element */
import { Container, Heading, Button } from '../../lib/ui';
import type { HeroBlock as HeroBlockType } from '../../lib/types';
import styles from './HeroBlock.module.css';

const alignClass = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
} as const;

export function HeroBlock({ block: b }: { block: HeroBlockType }) {
  const align = b.align ?? 'left';
  return (
    <div className={styles.hero}>
      <Container width="wide">
        <div className={`${styles.inner} ${alignClass[align]}`}>
          <Heading level={1} size="hero" align={align}>
            {b.title}
          </Heading>
          {b.subtitle && <p className={styles.subtitle}>{b.subtitle}</p>}
          {b.buttons && b.buttons.length > 0 && (
            <div className={styles.buttons}>
              {b.buttons.map((btn, i) => (
                <Button key={i} variant={btn.variant ?? (i === 0 ? 'primary' : 'secondary')} size="lg" href={btn.href}>
                  {btn.label}
                </Button>
              ))}
            </div>
          )}
          {b.image && <img src={b.image} alt={b.title} className={styles.image} />}
        </div>
      </Container>
    </div>
  );
}
