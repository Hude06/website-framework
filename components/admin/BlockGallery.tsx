'use client';

import type { Block } from '../../lib/types';
import { Button } from '../../lib/ui';
import styles from './BlockGallery.module.css';

export interface GalleryEntry {
  type: string;
  label: string;
  description: string;
  create: (id: string) => Block;
}

interface BlockGalleryProps {
  open: boolean;
  /** Merged framework + client entries. Required. */
  entries: GalleryEntry[];
  onSelect: (block: Block) => void;
  onClose: () => void;
}

function generateId(type: string): string {
  return `${type}-${Math.random().toString(36).slice(2, 9)}`;
}

export function BlockGallery({ open, entries, onSelect, onClose }: BlockGalleryProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>Add a block</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </header>
        <div className={styles.body}>
          <div className={styles.grid}>
            {entries.map((entry) => (
              <button
                key={entry.type}
                type="button"
                className={styles.tile}
                onClick={() => {
                  const newBlock = entry.create(generateId(entry.type));
                  onSelect(newBlock);
                }}
              >
                <span className={styles.tileLabel}>{entry.label}</span>
                <span className={styles.tileDesc}>{entry.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
