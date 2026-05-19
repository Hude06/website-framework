'use client';

import type { ImageBlock } from '../../../lib/types';
import { Stack, TextField, ImageField, SelectField } from '../../../lib/ui';

const widthOptions = [
  { value: 'narrow', label: 'Narrow' },
  { value: 'default', label: 'Default' },
  { value: 'wide', label: 'Wide' },
  { value: 'full', label: 'Full bleed' },
];

export function ImageEditor({ block, onChange }: { block: ImageBlock; onChange: (b: ImageBlock) => void }) {
  return (
    <Stack gap={4}>
      <ImageField label="Image" value={block.src} onChange={(src) => onChange({ ...block, src })} alt={block.alt} />
      <TextField label="Alt text" hint="Describe the image for screen readers" value={block.alt} onChange={(alt) => onChange({ ...block, alt })} />
      <TextField label="Caption (optional)" value={block.caption ?? ''} onChange={(v) => onChange({ ...block, caption: v || undefined })} />
      <SelectField label="Width" value={block.width ?? 'default'} options={widthOptions} onChange={(v) => onChange({ ...block, width: v as ImageBlock['width'] })} />
    </Stack>
  );
}
