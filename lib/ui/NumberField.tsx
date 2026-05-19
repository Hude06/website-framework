import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Field.module.css';

export interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField({ label, hint, error, value, onChange, ...rest }: NumberFieldProps) {
  return (
    <label className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        type="number"
        className={styles.input}
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => {
          const n = e.target.value === '' ? NaN : Number(e.target.value);
          onChange(Number.isFinite(n) ? n : 0);
        }}
        {...rest}
      />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}
