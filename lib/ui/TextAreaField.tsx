import type { TextareaHTMLAttributes, ReactNode } from 'react';
import styles from './Field.module.css';

export interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function TextAreaField({ label, hint, error, value, onChange, rows = 4, ...rest }: TextAreaFieldProps) {
  return (
    <label className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <textarea
        className={styles.textarea}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}
