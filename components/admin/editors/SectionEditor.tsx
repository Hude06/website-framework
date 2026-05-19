'use client';

import type { SectionBlock } from '../../../lib/types';
import { Stack, TextField, TextAreaField, SelectField } from '../../../lib/ui';

const bgOptions = [
  { value: 'default', label: 'Default background' },
  { value: 'muted', label: 'Muted' },
  { value: 'card', label: 'Card' },
  { value: 'accent', label: 'Accent' },
];

const paddingOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra large' },
];

export function SectionEditor({ block, onChange }: { block: SectionBlock; onChange: (b: SectionBlock) => void }) {
  return (
    <Stack gap={4}>
      <TextField label="Heading (optional)" value={block.heading ?? ''} onChange={(v) => onChange({ ...block, heading: v || undefined })} />
      <TextAreaField label="Body (optional)" value={block.body ?? ''} rows={4} onChange={(v) => onChange({ ...block, body: v || undefined })} />
      <SelectField label="Background" value={block.background ?? 'default'} options={bgOptions} onChange={(v) => onChange({ ...block, background: v as SectionBlock['background'] })} />
      <SelectField label="Padding" value={block.padding ?? 'md'} options={paddingOptions} onChange={(v) => onChange({ ...block, padding: v as SectionBlock['padding'] })} />
      <TextField label="Anchor ID (optional)" hint="For #anchor links in the URL" value={block.anchor ?? ''} onChange={(v) => onChange({ ...block, anchor: v || undefined })} />
    </Stack>
  );
}
