import type { SelectHTMLAttributes, ReactNode } from 'react';
import styles from './Field.module.css';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectFieldProps<T extends string = string>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
}

export function SelectField<T extends string = string>({
  label,
  hint,
  error,
  value,
  onChange,
  options,
  ...rest
}: SelectFieldProps<T>) {
  return (
    <label className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}
