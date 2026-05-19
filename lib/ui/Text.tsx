import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Text.module.css';

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type TextTone = 'default' | 'muted' | 'accent';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';
export type TextAs = 'p' | 'span' | 'div';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextAs;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  align?: TextAlign;
  children: ReactNode;
}

export function Text({
  as: Tag = 'p',
  size = 'base',
  tone = 'default',
  weight = 'regular',
  align,
  className,
  children,
  ...rest
}: TextProps) {
  const cls = [
    styles.text,
    styles[`size-${size}`],
    styles[`tone-${tone}`],
    styles[`weight-${weight}`],
    align && styles[`align-${align}`],
    className,
  ].filter(Boolean).join(' ');
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
