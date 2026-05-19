'use client';

import { useRef, useState, type ReactNode } from 'react';
import styles from './Field.module.css';
import { Button } from './Button';

export interface ImageFieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  value: string;
  onChange: (value: string) => void;
  alt?: string;
}

export function ImageField({ label, hint, error, value, onChange, alt }: ImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (!json.success) {
        setUploadError(json.error ?? 'Upload failed');
      } else {
        onChange(json.data.path);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.imageBox}>
        {value && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={value} alt={alt ?? ''} className={styles.imagePreview} />
        )}
        <div className={styles.imageUrlRow}>
          <input
            type="text"
            className={styles.input}
            value={value}
            placeholder="Image URL or upload below"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <div className={styles.imageActions}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>
              Clear
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
      {uploadError && <span className={styles.error}>{uploadError}</span>}
      {hint && !error && !uploadError && <span className={styles.hint}>{hint}</span>}
      {error && !uploadError && <span className={styles.error}>{error}</span>}
    </div>
  );
}
