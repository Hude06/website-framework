'use client';

import type { QuoteBlock } from '../../../lib/types';
import { Stack, TextField, TextAreaField, ImageField } from '../../../lib/ui';

export function QuoteEditor({ block, onChange }: { block: QuoteBlock; onChange: (b: QuoteBlock) => void }) {
  return (
    <Stack gap={4}>
      <TextAreaField label="Quote" value={block.quote} rows={3} onChange={(quote) => onChange({ ...block, quote })} />
      <TextField label="Author (optional)" value={block.author ?? ''} onChange={(v) => onChange({ ...block, author: v || undefined })} />
      <TextField label="Role / company (optional)" value={block.role ?? ''} onChange={(v) => onChange({ ...block, role: v || undefined })} />
      <ImageField label="Author photo (optional)" value={block.image ?? ''} onChange={(v) => onChange({ ...block, image: v || undefined })} alt={block.author} />
    </Stack>
  );
}
