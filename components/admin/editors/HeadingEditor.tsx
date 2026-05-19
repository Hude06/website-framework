'use client';

import type { HeadingBlock } from '../../../lib/types';
import { Stack, TextField, NumberField, SelectField } from '../../../lib/ui';

const sizeOptions = [
  { value: '', label: 'Default (auto for level)' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'XL' },
  { value: 'display', label: 'Display' },
  { value: 'hero', label: 'Hero' },
];

const toneOptions = [
  { value: 'default', label: 'Default' },
  { value: 'muted', label: 'Muted' },
  { value: 'accent', label: 'Accent' },
];

const alignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

export function HeadingEditor({ block, onChange }: { block: HeadingBlock; onChange: (b: HeadingBlock) => void }) {
  return (
    <Stack gap={4}>
      <TextField label="Text" value={block.text} onChange={(text) => onChange({ ...block, text })} />
      <NumberField label="Level (1–6)" value={block.level ?? 2} min={1} max={6} onChange={(n) => onChange({ ...block, level: Math.max(1, Math.min(6, Math.round(n))) as 1 | 2 | 3 | 4 | 5 | 6 })} />
      <SelectField label="Size" value={block.size ?? ''} options={sizeOptions} onChange={(v) => onChange({ ...block, size: v ? (v as HeadingBlock['size']) : undefined })} />
      <SelectField label="Tone" value={block.tone ?? 'default'} options={toneOptions} onChange={(v) => onChange({ ...block, tone: v as HeadingBlock['tone'] })} />
      <SelectField label="Alignment" value={block.align ?? 'left'} options={alignOptions} onChange={(v) => onChange({ ...block, align: v as HeadingBlock['align'] })} />
    </Stack>
  );
}
