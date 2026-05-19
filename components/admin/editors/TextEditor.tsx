'use client';

import type { TextBlock } from '../../../lib/types';
import { Stack, TextAreaField, SelectField } from '../../../lib/ui';

const sizeOptions = [
  { value: 'xs', label: 'Extra small' },
  { value: 'sm', label: 'Small' },
  { value: 'base', label: 'Base' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra large' },
];

const toneOptions = [
  { value: 'default', label: 'Default' },
  { value: 'muted', label: 'Muted' },
  { value: 'accent', label: 'Accent' },
];

const weightOptions = [
  { value: 'regular', label: 'Regular' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semibold' },
  { value: 'bold', label: 'Bold' },
];

const alignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

export function TextEditor({ block, onChange }: { block: TextBlock; onChange: (b: TextBlock) => void }) {
  return (
    <Stack gap={4}>
      <TextAreaField
        label="Body"
        hint="Separate paragraphs with a blank line"
        value={block.body}
        rows={8}
        onChange={(body) => onChange({ ...block, body })}
      />
      <SelectField label="Size" value={block.size ?? 'base'} options={sizeOptions} onChange={(v) => onChange({ ...block, size: v as TextBlock['size'] })} />
      <SelectField label="Tone" value={block.tone ?? 'default'} options={toneOptions} onChange={(v) => onChange({ ...block, tone: v as TextBlock['tone'] })} />
      <SelectField label="Weight" value={block.weight ?? 'regular'} options={weightOptions} onChange={(v) => onChange({ ...block, weight: v as TextBlock['weight'] })} />
      <SelectField label="Alignment" value={block.align ?? 'left'} options={alignOptions} onChange={(v) => onChange({ ...block, align: v as TextBlock['align'] })} />
    </Stack>
  );
}
