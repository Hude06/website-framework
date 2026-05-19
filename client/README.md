# Client Customization Zone

This directory is **client-owned**. Everything under `client/` belongs to the individual client site and is never modified by framework updates.

Framework updates (via `git merge framework/main`) touch files **outside** this directory. Files inside `client/` are yours to edit, delete, or rearrange.

## What goes here

| File / Directory | Purpose |
|---|---|
| `client/registry.ts` | Register custom block render components |
| `client/editor-registry.ts` | Register custom block admin editors + labels |
| `client/gallery.ts` | Register custom blocks in the admin "Add Block" dialog |
| `client/types.ts` | Define TypeScript types for custom blocks (extends the `Block` union) |
| `client/theme.ts` | Register custom theme presets |
| `client/themes/*.json` | Custom theme JSON files |
| `client/blocks/<Name>/` | Source files for each custom block (render, editor, manifest) |
| `client/placeholders.json` | (optional) Override or add to the framework's default placeholder assets |

## Adding a custom block

Each custom block lives in its own directory under `client/blocks/` and ships three files:

```
client/blocks/AcmeHero/
├── AcmeHeroBlock.tsx     # renders on the live site
├── AcmeHeroEditor.tsx    # admin panel editor form
└── manifest.ts           # gallery entry + type label + default data
```

### 1. Define the type

Edit `client/types.ts`:

```ts
export interface AcmeHeroBlock {
  id: string;
  type: 'acme-hero';
  headline: string;
  subheadline?: string;
}

export type ClientBlock = AcmeHeroBlock;
```

If you have multiple custom blocks, union them:

```ts
export type ClientBlock = AcmeHeroBlock | AcmeFeaturesBlock;
```

### 2. Build the renderer

`client/blocks/AcmeHero/AcmeHeroBlock.tsx` — compose from `lib/ui` primitives (no Tailwind, no shadcn):

```tsx
import type { AcmeHeroBlock as AcmeHeroBlockType } from '@/client/types';
import { Container, Stack, Heading, Text } from '@/lib/ui';

export function AcmeHeroBlock({ block }: { block: AcmeHeroBlockType }) {
  return (
    <div style={{ paddingBlock: 'var(--space-20)' }}>
      <Container width="wide">
        <Stack gap={4} align="center">
          <Heading level={1} size="hero" align="center">{block.headline}</Heading>
          {block.subheadline && (
            <Text size="xl" tone="muted" align="center">{block.subheadline}</Text>
          )}
        </Stack>
      </Container>
    </div>
  );
}
```

For block-specific layout that doesn't fit a primitive, add a co-located CSS Module (`AcmeHeroBlock.module.css`) and import it. Always use design tokens (CSS variables — see `AI_PLAYBOOK.md` §4) for colors, spacing, type — never hard-coded values.

### 3. Build the admin editor

`client/blocks/AcmeHero/AcmeHeroEditor.tsx` — compose from form primitives:

```tsx
import type { AcmeHeroBlock as AcmeHeroBlockType } from '@/client/types';
import { Stack, TextField, TextAreaField } from '@/lib/ui';

interface Props {
  block: AcmeHeroBlockType;
  onChange: (updated: AcmeHeroBlockType) => void;
}

export function AcmeHeroEditor({ block, onChange }: Props) {
  return (
    <Stack gap={4}>
      <TextField
        label="Headline"
        value={block.headline}
        onChange={(headline) => onChange({ ...block, headline })}
      />
      <TextAreaField
        label="Subheadline"
        value={block.subheadline ?? ''}
        rows={2}
        onChange={(v) => onChange({ ...block, subheadline: v || undefined })}
      />
    </Stack>
  );
}
```

Available form primitives: `TextField`, `TextAreaField`, `NumberField`, `SelectField`, `ToggleField`, `ImageField`, `ArrayField` — all from `@/lib/ui`.

### 4. Define the gallery manifest

`client/blocks/AcmeHero/manifest.ts`:

```ts
import type { ClientBlockTemplate } from '@/client/gallery';

export const acmeHeroManifest: ClientBlockTemplate = {
  type: 'acme-hero',
  label: 'Acme Hero',
  description: 'Big centered headline for Acme-branded pages',
  icon: '✧',
  create: (id) => ({
    id,
    type: 'acme-hero',
    headline: 'A new headline',
    subheadline: '',
  }),
};
```

### 5. Register all three

Edit `client/registry.ts`:

```ts
import type { ComponentType } from 'react';
import { AcmeHeroBlock } from './blocks/AcmeHero/AcmeHeroBlock';

export const clientBlocks: Record<string, ComponentType<{ block: never }>> = {
  'acme-hero': AcmeHeroBlock as ComponentType<{ block: never }>,
};
```

Edit `client/editor-registry.ts`:

```ts
import type { ComponentType } from 'react';
import type { ClientEditorProps } from './editor-registry';
import { AcmeHeroEditor } from './blocks/AcmeHero/AcmeHeroEditor';

export const clientEditors: Record<string, ComponentType<ClientEditorProps>> = {
  'acme-hero': AcmeHeroEditor as ComponentType<ClientEditorProps>,
};

export const clientTypeLabels: Record<string, string> = {
  'acme-hero': 'Acme Hero',
};
```

Edit `client/gallery.ts`:

```ts
import type { ClientBlockTemplate } from './gallery';
import { acmeHeroManifest } from './blocks/AcmeHero/manifest';

export const clientTemplates: ClientBlockTemplate[] = [acmeHeroManifest];
```

That's it — your block now renders on the live site AND appears in the admin panel.

## Adding a custom theme

Drop a JSON file matching the `ThemePreset` shape (see `lib/themes.ts`) into `client/themes/`, then register it in `client/theme.ts`:

```ts
import type { ThemePreset } from '@/lib/themes';
import acme from './themes/acme.json';

export const clientThemes: Record<string, ThemePreset> = {
  acme: acme as ThemePreset,
};
```

A client theme with the same name as a framework theme (e.g. `editorial`) overrides the framework version.

## Overriding placeholder assets

Create `client/placeholders.json` with the same shape as `content/placeholders.json`. Categories are shallow-merged — your categories override the framework defaults; categories you don't list fall through.

## Can I edit framework files?

No. Framework-owned files (everything outside `client/`, `content/pages/`, `content/site.json`, `public/uploads/`) are managed by the framework and updated via `git merge framework/main`. Editing them will cause merge conflicts on every future update.

If you genuinely need a framework change, make it in the framework repo (https://github.com/Hude06/website-framework), then pull it down with `scripts/sync-framework.sh`.

For emergency patches in a client site, set `FRAMEWORK_EDIT=1` in your shell to disable the guardrail — but know that you're taking on future merge resolution work.
