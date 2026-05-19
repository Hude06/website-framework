'use client';

import type { NavLink } from '../../lib/types';
import { Stack, TextField, ArrayField } from '../../lib/ui';

interface NavEditorProps {
  nav: NavLink[];
  onChange: (nav: NavLink[]) => void;
}

export function NavEditor({ nav, onChange }: NavEditorProps) {
  return (
    <ArrayField<NavLink>
      label="Navigation links"
      hint="These appear in the site header"
      items={nav}
      onChange={onChange}
      createItem={() => ({ label: 'New link', href: '/' })}
      itemLabel={(item) => item.label || 'Untitled link'}
      maxItems={20}
      addLabel="Add nav link"
      renderItem={(item, _i, update) => (
        <Stack gap={3}>
          <TextField label="Label" value={item.label} onChange={(label) => update({ ...item, label })} />
          <TextField label="Link (href)" value={item.href} onChange={(href) => update({ ...item, href })} />
        </Stack>
      )}
    />
  );
}
