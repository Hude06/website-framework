'use client';

import type { ReactNode } from 'react';
import styles from './Field.module.css';
import { Button } from './Button';

export interface ArrayFieldProps<T> {
  label?: ReactNode;
  hint?: ReactNode;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, index: number, update: (next: T) => void) => ReactNode;
  itemLabel?: (item: T, index: number) => string;
  minItems?: number;
  maxItems?: number;
  addLabel?: string;
}

export function ArrayField<T>({
  label,
  hint,
  items,
  onChange,
  createItem,
  renderItem,
  itemLabel,
  minItems = 0,
  maxItems,
  addLabel = 'Add item',
}: ArrayFieldProps<T>) {
  function update(index: number, next: T) {
    const copy = items.slice();
    copy[index] = next;
    onChange(copy);
  }

  function remove(index: number) {
    if (items.length <= minItems) return;
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const copy = items.slice();
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  }

  function add() {
    if (maxItems !== undefined && items.length >= maxItems) return;
    onChange([...items, createItem()]);
  }

  const canAdd = maxItems === undefined || items.length < maxItems;

  return (
    <div className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.arrayField}>
        {items.map((item, index) => (
          <div key={index} className={styles.arrayItem}>
            <div className={styles.arrayItemHeader}>
              <span>{itemLabel ? itemLabel(item, index) : `Item ${index + 1}`}</span>
              <div className={styles.arrayItemControls}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => remove(index)}
                  disabled={items.length <= minItems}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </div>
            {renderItem(item, index, (next) => update(index, next))}
          </div>
        ))}
        {canAdd && (
          <Button type="button" variant="secondary" size="sm" onClick={add}>
            + {addLabel}
          </Button>
        )}
      </div>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
