'use client';

import type { HeroBlock, CtaLink } from '../../../lib/types';
import { Stack, TextField, TextAreaField, ImageField, SelectField, ArrayField } from '../../../lib/ui';

const alignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const variantOptions = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'accent', label: 'Accent' },
];

export function HeroEditor({ block, onChange }: { block: HeroBlock; onChange: (b: HeroBlock) => void }) {
  return (
    <Stack gap={4}>
      <TextField label="Title" value={block.title} onChange={(title) => onChange({ ...block, title })} />
      <TextAreaField label="Subtitle (optional)" value={block.subtitle ?? ''} rows={3} onChange={(v) => onChange({ ...block, subtitle: v || undefined })} />
      <SelectField label="Alignment" value={block.align ?? 'left'} options={alignOptions} onChange={(v) => onChange({ ...block, align: v as HeroBlock['align'] })} />
      <ImageField label="Image (optional)" value={block.image ?? ''} onChange={(v) => onChange({ ...block, image: v || undefined })} alt={block.title} />
      <ArrayField<CtaLink>
        label="Buttons"
        items={block.buttons ?? []}
        onChange={(buttons) => onChange({ ...block, buttons })}
        createItem={() => ({ label: 'Button', href: '/', variant: 'primary' })}
        itemLabel={(b) => b.label || 'Untitled button'}
        maxItems={4}
        addLabel="Add button"
        renderItem={(item, _i, update) => (
          <Stack gap={3}>
            <TextField label="Label" value={item.label} onChange={(label) => update({ ...item, label })} />
            <TextField label="Link" value={item.href} onChange={(href) => update({ ...item, href })} />
            <SelectField label="Variant" value={item.variant ?? 'primary'} options={variantOptions} onChange={(v) => update({ ...item, variant: v as CtaLink['variant'] })} />
          </Stack>
        )}
      />
    </Stack>
  );
}
