import type { ReactNode } from 'react';
import styles from './Field.module.css';

export interface ToggleFieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function ToggleField({ label, hint, value, onChange, disabled }: ToggleFieldProps) {
  return (
    <div className={styles.field}>
      <div className={styles.toggleRow}>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          disabled={disabled}
          onClick={() => onChange(!value)}
          className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
        />
        {label && <span className={styles.label} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }} onClick={() => !disabled && onChange(!value)}>{label}</span>}
      </div>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
