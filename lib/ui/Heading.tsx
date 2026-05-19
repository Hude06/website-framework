import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | 'display' | 'hero';
export type HeadingTone = 'default' | 'muted' | 'accent';
export type HeadingAlign = 'left' | 'center' | 'right';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  size?: HeadingSize;
  tone?: HeadingTone;
  align?: HeadingAlign;
  children: ReactNode;
}

const defaultSizeForLevel: Record<HeadingLevel, HeadingSize> = {
  1: 'display',
  2: 'xl',
  3: 'lg',
  4: 'md',
  5: 'sm',
  6: 'sm',
};

export function Heading({
  level = 2,
  size,
  tone = 'default',
  align,
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as const;
  const finalSize = size ?? defaultSizeForLevel[level];
  const cls = [
    styles.heading,
    styles[`size-${finalSize}`],
    styles[`tone-${tone}`],
    align && styles[`align-${align}`],
    className,
  ].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
