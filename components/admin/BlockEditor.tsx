'use client';

import type { Block } from '../../lib/types';
import type { EditorRegistry } from './editors';

interface BlockEditorProps {
  block: Block;
  onChange: (next: Block) => void;
  /** Merged framework + client editor map. Required — no implicit framework default
     so consumers don't accidentally render a stale registry. */
  registry: EditorRegistry;
}

export function BlockEditor({ block, onChange, registry }: BlockEditorProps) {
  const Editor = registry[block.type];
  if (!Editor) {
    return (
      <div style={{ padding: 'var(--space-4)', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>
        No editor registered for block type: <code>{block.type}</code>
      </div>
    );
  }
  return <Editor block={block as never} onChange={onChange as never} />;
}
