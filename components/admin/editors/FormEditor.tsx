'use client';

import type { FormBlock, FormField } from '../../../lib/types';
import { Stack, TextField, SelectField, ToggleField, ArrayField } from '../../../lib/ui';

const fieldTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'email', label: 'Email' },
];

export function FormEditor({ block, onChange }: { block: FormBlock; onChange: (b: FormBlock) => void }) {
  return (
    <Stack gap={4}>
      <TextField label="Heading (optional)" value={block.heading ?? ''} onChange={(v) => onChange({ ...block, heading: v || undefined })} />
      <TextField label="Submit button label" value={block.submitLabel ?? 'Submit'} onChange={(v) => onChange({ ...block, submitLabel: v || undefined })} />
      <TextField label="Action URL (optional)" hint="Where to POST the form" value={block.action ?? ''} onChange={(v) => onChange({ ...block, action: v || undefined })} />
      <ArrayField<FormField>
        label="Fields"
        items={block.fields}
        onChange={(fields) => onChange({ ...block, fields })}
        createItem={() => ({ name: `field_${Date.now()}`, label: 'New field', type: 'text' })}
        itemLabel={(f) => f.label || f.name}
        maxItems={20}
        addLabel="Add field"
        renderItem={(item, _i, update) => (
          <Stack gap={3}>
            <TextField label="Label" value={item.label} onChange={(label) => update({ ...item, label })} />
            <TextField label="Name (form key)" hint="lowercase, no spaces" value={item.name} onChange={(name) => update({ ...item, name })} />
            <SelectField label="Type" value={item.type} options={fieldTypeOptions} onChange={(v) => update({ ...item, type: v as FormField['type'] })} />
            <TextField label="Placeholder (optional)" value={item.placeholder ?? ''} onChange={(v) => update({ ...item, placeholder: v || undefined })} />
            <ToggleField label="Required" value={item.required ?? false} onChange={(required) => update({ ...item, required })} />
          </Stack>
        )}
      />
    </Stack>
  );
}
