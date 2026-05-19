'use client';

import styles from './PreviewPanel.module.css';

interface PreviewPanelProps {
  slug: string | null;
  refreshKey: number;
}

export function PreviewPanel({ slug, refreshKey }: PreviewPanelProps) {
  if (!slug) {
    return (
      <div className={styles.preview}>
        <div className={styles.empty}>Select a page to preview</div>
      </div>
    );
  }

  const src = slug === 'home' ? '/' : `/${slug}`;

  return (
    <div className={styles.preview}>
      <iframe
        key={`${slug}-${refreshKey}`}
        src={src}
        className={styles.frame}
        title="Page preview"
      />
    </div>
  );
}
