'use client';

import type { TwoColumnBlock, ColumnSide } from '../../../lib/types';
import { Stack, TextField, TextAreaField, ImageField, SelectField, ToggleField } from '../../../lib/ui';

const ratioOptions = [
  { value: '50-50', label: '50 / 50 (even)' },
  { value: '60-40', label: '60 / 40 (left heavy)' },
  { value: '40-60', label: '40 / 60 (right heavy)' },
];

function SideEditor({
  label,
  side,
  onChange,
}: {
  label: string;
  side: ColumnSide;
  onChange: (next: ColumnSide) => void;
}) {
  const hasButton = !!side.button;
  return (
    <Stack gap={3}>
      <strong style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
        {label}
      </strong>
      <TextField label="Title" value={side.title ?? ''} onChange={(v) => onChange({ ...side, title: v || undefined })} />
      <TextAreaField label="Body" value={side.body ?? ''} rows={3} onChange={(v) => onChange({ ...side, body: v || undefined })} />
      <ImageField label="Image" value={side.image ?? ''} onChange={(v) => onChange({ ...side, image: v || undefined })} alt={side.title} />
      <ToggleField
        label="Include button"
        value={hasButton}
        onChange={(v) => onChange({ ...side, button: v ? (side.button ?? { label: 'Learn more', href: '/' }) : undefined })}
      />
      {hasButton && side.button && (
        <Stack gap={2}>
          <TextField label="Button label" value={side.button.label} onChange={(label) => onChange({ ...side, button: { ...side.button!, label } })} />
          <TextField label="Button link" value={side.button.href} onChange={(href) => onChange({ ...side, button: { ...side.button!, href } })} />
        </Stack>
      )}
    </Stack>
  );
}

export function TwoColumnEditor({ block, onChange }: { block: TwoColumnBlock; onChange: (b: TwoColumnBlock) => void }) {
  return (
    <Stack gap={5}>
      <SelectField label="Ratio" value={block.ratio ?? '50-50'} options={ratioOptions} onChange={(v) => onChange({ ...block, ratio: v as TwoColumnBlock['ratio'] })} />
      <SideEditor label="Left column" side={block.left} onChange={(left) => onChange({ ...block, left })} />
      <SideEditor label="Right column" side={block.right} onChange={(right) => onChange({ ...block, right })} />
    </Stack>
  );
}
