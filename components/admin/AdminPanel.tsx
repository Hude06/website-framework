'use client';

import { useEffect, useState, useCallback } from 'react';
import type { PageContent, Block, SiteConfig } from '../../lib/types';
import {
  fetchPages,
  fetchPage,
  savePage,
  createPage,
  deletePageApi,
  fetchSiteConfig,
  saveSiteConfig,
  triggerRebuild,
} from '../../lib/admin-api';
import { Button, TextField } from '../../lib/ui';
import { PageSidebar } from './PageSidebar';
import { BlockEditor } from './BlockEditor';
import { BlockGallery, type GalleryEntry } from './BlockGallery';
import { PreviewPanel } from './PreviewPanel';
import { NavEditor } from './NavEditor';
import { SiteSettingsEditor } from './SiteSettingsEditor';
import type { EditorRegistry } from './editors';
import styles from './AdminPanel.module.css';

interface PageInfo {
  slug: string;
  title: string;
}

type View =
  | { kind: 'page'; slug: string }
  | { kind: 'nav' }
  | { kind: 'settings' };

export interface AdminPanelProps {
  /** Merged framework + client block editor registry. */
  editorRegistry: EditorRegistry;
  /** Merged framework + client gallery entries (for the "Add block" dialog). */
  galleryEntries: GalleryEntry[];
}

export function AdminPanel({ editorRegistry, galleryEntries }: AdminPanelProps) {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [view, setView] = useState<View | null>(null);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const loadPages = useCallback(async () => {
    try {
      const list = await fetchPages();
      setPages(list);
      return list;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load pages');
      return [];
    }
  }, []);

  useEffect(() => {
    (async () => {
      const [list, cfg] = await Promise.all([loadPages(), fetchSiteConfig().catch(() => null)]);
      if (cfg) setSiteConfig(cfg);
      if (list.length > 0) {
        setView({ kind: 'page', slug: list[0].slug });
      }
    })();
  }, [loadPages]);

  useEffect(() => {
    if (!view || view.kind !== 'page') {
      setPageContent(null);
      return;
    }
    (async () => {
      try {
        const content = await fetchPage(view.slug);
        setPageContent(content);
        setDirty(false);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load page');
      }
    })();
  }, [view]);

  function updateBlock(idx: number, next: Block) {
    if (!pageContent) return;
    const blocks = pageContent.blocks.slice();
    blocks[idx] = next;
    setPageContent({ ...pageContent, blocks });
    setDirty(true);
  }

  function removeBlock(idx: number) {
    if (!pageContent) return;
    if (!confirm('Remove this block?')) return;
    setPageContent({ ...pageContent, blocks: pageContent.blocks.filter((_, i) => i !== idx) });
    setDirty(true);
  }

  function moveBlock(idx: number, delta: number) {
    if (!pageContent) return;
    const target = idx + delta;
    if (target < 0 || target >= pageContent.blocks.length) return;
    const blocks = pageContent.blocks.slice();
    [blocks[idx], blocks[target]] = [blocks[target], blocks[idx]];
    setPageContent({ ...pageContent, blocks });
    setDirty(true);
  }

  function addBlock(block: Block) {
    if (!pageContent) return;
    setPageContent({ ...pageContent, blocks: [...pageContent.blocks, block] });
    setDirty(true);
    setGalleryOpen(false);
  }

  async function handleSave() {
    if (!view) return;
    setSaving(true);
    setError(null);
    try {
      if (view.kind === 'page' && pageContent) {
        await savePage(pageContent);
      } else if ((view.kind === 'nav' || view.kind === 'settings') && siteConfig) {
        await saveSiteConfig(siteConfig);
      }
      setDirty(false);
      setRefreshKey((k) => k + 1);
      setInfo('Saved');
      setTimeout(() => setInfo(null), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleRebuild() {
    if (!confirm('Rebuild the site? This commits all changes and rebuilds.')) return;
    setSaving(true);
    setError(null);
    try {
      const result = await triggerRebuild();
      setInfo(`Rebuild ${result.rebuilt ? 'complete' : 'queued'}${result.committed ? ' (committed)' : ''}`);
      setTimeout(() => setInfo(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rebuild failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreatePage(title: string, slug: string) {
    try {
      await createPage(title, slug);
      await loadPages();
      setView({ kind: 'page', slug });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create page failed');
    }
  }

  async function handleDeletePage(slug: string) {
    if (slug === 'home') {
      setError('Cannot delete the home page');
      return;
    }
    try {
      await deletePageApi(slug);
      const remaining = await loadPages();
      setView(remaining.length ? { kind: 'page', slug: remaining[0].slug } : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  const previewSlug = view?.kind === 'page' ? view.slug : 'home';

  return (
    <div className={styles.shell}>
      <div className={styles.sidebar}>
        <PageSidebar
          pages={pages}
          currentSlug={view?.kind === 'page' ? view.slug : null}
          view={view?.kind === 'page' ? 'page' : view?.kind ?? 'page'}
          onSelect={(slug) => setView({ kind: 'page', slug })}
          onSelectView={(v) => setView({ kind: v })}
          onCreate={handleCreatePage}
          onDelete={handleDeletePage}
        />
      </div>

      <div className={styles.editor}>
        <header className={styles.editorHeader}>
          <span className={styles.editorHeaderTitle}>
            {view?.kind === 'page' ? pageContent?.title ?? 'Loading…' :
             view?.kind === 'nav' ? 'Navigation' :
             view?.kind === 'settings' ? 'Settings' : 'No selection'}
          </span>
          <div className={styles.flex}>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={!dirty || saving}>
              {saving ? 'Saving…' : dirty ? 'Save' : 'Saved'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleRebuild} disabled={saving}>
              Rebuild
            </Button>
          </div>
        </header>

        {error && (
          <div className={`${styles.banner} ${styles.bannerError}`}>
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>
          </div>
        )}
        {info && !error && (
          <div className={styles.banner}>
            <span>{info}</span>
          </div>
        )}

        <div className={styles.editorBody}>
          {view?.kind === 'page' && pageContent && (
            <>
              <div className={styles.titleEdit}>
                <TextField
                  label="Page title"
                  value={pageContent.title}
                  onChange={(title) => { setPageContent({ ...pageContent, title }); setDirty(true); }}
                />
              </div>

              <div className={styles.blockList}>
                {pageContent.blocks.length === 0 ? (
                  <div className={styles.empty}>No blocks yet. Add one below.</div>
                ) : (
                  pageContent.blocks.map((block, idx) => (
                    <div key={block.id} className={styles.blockCard}>
                      <div className={styles.blockHeader}>
                        <span>{block.type}</span>
                        <div className={styles.blockControls}>
                          <button className={styles.iconBtn} onClick={() => moveBlock(idx, -1)} disabled={idx === 0} title="Move up">↑</button>
                          <button className={styles.iconBtn} onClick={() => moveBlock(idx, 1)} disabled={idx === pageContent.blocks.length - 1} title="Move down">↓</button>
                          <button className={styles.iconBtn} onClick={() => removeBlock(idx)} title="Remove">×</button>
                        </div>
                      </div>
                      <div className={styles.blockBody}>
                        <BlockEditor block={block} onChange={(next) => updateBlock(idx, next)} registry={editorRegistry} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Button variant="secondary" size="md" onClick={() => setGalleryOpen(true)}>
                + Add block
              </Button>
            </>
          )}

          {view?.kind === 'nav' && siteConfig && (
            <NavEditor
              nav={siteConfig.nav}
              onChange={(nav) => { setSiteConfig({ ...siteConfig, nav }); setDirty(true); }}
            />
          )}

          {view?.kind === 'settings' && siteConfig && (
            <SiteSettingsEditor
              config={siteConfig}
              onChange={(c) => { setSiteConfig(c); setDirty(true); }}
            />
          )}

          {!view && <div className={styles.empty}>Loading…</div>}
        </div>
      </div>

      <PreviewPanel slug={previewSlug} refreshKey={refreshKey} />

      <BlockGallery open={galleryOpen} entries={galleryEntries} onSelect={addBlock} onClose={() => setGalleryOpen(false)} />
    </div>
  );
}
