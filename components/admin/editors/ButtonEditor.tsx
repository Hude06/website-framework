'use client';

import type { ButtonBlock } from '../../../lib/types';
import { Stack, TextField, SelectField } from '../../../lib/ui';

const variantOptions = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'accent', label: 'Accent' },
  { value: 'destructive', label: 'Destructive' },
];

const sizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

const alignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

export function ButtonEditor({ block, onChange }: { block: ButtonBlock; onChange: (b: ButtonBlock) => void }) {
  return (
    <Stack gap={4}>
      <TextField label="Label" value={block.label} onChange={(label) => onChange({ ...block, label })} />
      <TextField label="Link (href)" hint="/, https://…, #anchor, mailto:" value={block.href} onChange={(href) => onChange({ ...block, href })} />
      <SelectField label="Variant" value={block.variant ?? 'primary'} options={variantOptions} onChange={(v) => onChange({ ...block, variant: v as ButtonBlock['variant'] })} />
      <SelectField label="Size" value={block.size ?? 'md'} options={sizeOptions} onChange={(v) => onChange({ ...block, size: v as ButtonBlock['size'] })} />
      <SelectField label="Alignment" value={block.align ?? 'left'} options={alignOptions} onChange={(v) => onChange({ ...block, align: v as ButtonBlock['align'] })} />
    </Stack>
  );
}
