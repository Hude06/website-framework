'use client';

import { useState } from 'react';
import { Button, TextField } from '../../lib/ui';
import styles from './PageSidebar.module.css';

interface PageInfo {
  slug: string;
  title: string;
}

interface PageSidebarProps {
  pages: PageInfo[];
  currentSlug: string | null;
  onSelect: (slug: string) => void;
  onCreate: (title: string, slug: string) => Promise<void>;
  onDelete: (slug: string) => Promise<void>;
  view: 'page' | 'nav' | 'settings';
  onSelectView: (v: 'nav' | 'settings') => void;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
}

export function PageSidebar({
  pages,
  currentSlug,
  onSelect,
  onCreate,
  onDelete,
  view,
  onSelectView,
}: PageSidebarProps) {
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');

  async function handleCreate() {
    if (!newTitle.trim() || !newSlug.trim()) return;
    await onCreate(newTitle.trim(), newSlug.trim());
    setNewTitle('');
    setNewSlug('');
    setCreating(false);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Pages</div>
        <div className={styles.list}>
          {pages.map((p) => (
            <button
              key={p.slug}
              className={`${styles.item} ${view === 'page' && currentSlug === p.slug ? styles.itemActive : ''}`}
              onClick={() => onSelect(p.slug)}
            >
              <span>{p.title}</span>
              <span className={styles.slug}>/{p.slug}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.newPage}>
        {creating ? (
          <>
            <TextField
              label="Page title"
              value={newTitle}
              onChange={(v) => {
                setNewTitle(v);
                if (!newSlug || newSlug === slugify(newTitle)) setNewSlug(slugify(v));
              }}
              placeholder="About us"
            />
            <TextField
              label="Slug"
              value={newSlug}
              onChange={(v) => setNewSlug(slugify(v))}
              placeholder="about-us"
              hint="Lowercase, dashes only"
            />
            <div className={styles.flex}>
              <Button variant="primary" size="sm" onClick={handleCreate}>Create</Button>
              <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>Cancel</Button>
            </div>
          </>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => setCreating(true)}>+ New page</Button>
        )}
        {currentSlug && view === 'page' && currentSlug !== 'home' && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm(`Delete page "${currentSlug}"?`)) onDelete(currentSlug);
            }}
          >
            Delete current page
          </Button>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Site</div>
        <div className={styles.list}>
          <button
            className={`${styles.item} ${view === 'nav' ? styles.itemActive : ''}`}
            onClick={() => onSelectView('nav')}
          >
            Navigation
          </button>
          <button
            className={`${styles.item} ${view === 'settings' ? styles.itemActive : ''}`}
            onClick={() => onSelectView('settings')}
          >
            Settings
          </button>
        </div>
      </div>
    </aside>
  );
}
