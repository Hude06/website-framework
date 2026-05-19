'use client';

import type { SiteConfig } from '../../lib/types';
import { Stack, TextField, SelectField, Heading } from '../../lib/ui';

const themeOptions = [
  { value: 'editorial', label: 'Editorial' },
  { value: 'studio', label: 'Studio' },
  { value: 'tech', label: 'Tech' },
  { value: 'warm', label: 'Warm' },
  { value: 'monochrome', label: 'Monochrome' },
];

const appearanceOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto (system)' },
];

const pairOptions = [
  { value: '', label: 'Custom (use heading + body fonts below)' },
  { value: 'editorial', label: 'Editorial (Instrument Serif + Inter)' },
  { value: 'studio', label: 'Studio (Bricolage + JetBrains Mono)' },
  { value: 'tech', label: 'Tech (JetBrains Mono + Geist)' },
  { value: 'warm', label: 'Warm (Fraunces + Lora)' },
  { value: 'monochrome', label: 'Monochrome (Geist only)' },
];

interface SiteSettingsEditorProps {
  config: SiteConfig;
  onChange: (config: SiteConfig) => void;
}

export function SiteSettingsEditor({ config, onChange }: SiteSettingsEditorProps) {
  return (
    <Stack gap={5}>
      <Heading level={3} size="lg">Site settings</Heading>

      <TextField
        label="Site name"
        value={config.siteName}
        onChange={(siteName) => onChange({ ...config, siteName })}
      />

      <Heading level={4} size="md">Theme</Heading>
      <SelectField
        label="Theme preset"
        value={config.theme?.preset ?? 'editorial'}
        options={themeOptions}
        onChange={(v) => onChange({ ...config, theme: { ...config.theme, preset: v as SiteConfig['theme'] extends infer T ? T extends { preset?: infer P } ? P : never : never } })}
      />
      <SelectField
        label="Appearance"
        value={config.theme?.appearance ?? 'light'}
        options={appearanceOptions}
        onChange={(v) => onChange({ ...config, theme: { ...config.theme, appearance: v as 'light' | 'dark' | 'auto' } })}
      />

      <Heading level={4} size="md">Fonts</Heading>
      <SelectField
        label="Font pair (presets)"
        value={config.fonts.pair ?? ''}
        options={pairOptions}
        onChange={(v) => onChange({ ...config, fonts: { ...config.fonts, pair: (v || undefined) as SiteConfig['fonts']['pair'] } })}
      />
      <TextField
        label="Heading font (CSS family)"
        hint="Used when no preset pair is selected"
        value={config.fonts.heading}
        onChange={(heading) => onChange({ ...config, fonts: { ...config.fonts, heading } })}
      />
      <TextField
        label="Body font (CSS family)"
        value={config.fonts.body}
        onChange={(body) => onChange({ ...config, fonts: { ...config.fonts, body } })}
      />

      <Heading level={4} size="md">Colors (legacy fallback)</Heading>
      <TextField
        label="Primary"
        hint="Hex value used when no theme preset is active"
        value={config.colors.primary}
        onChange={(primary) => onChange({ ...config, colors: { ...config.colors, primary } })}
      />
      <TextField
        label="Background"
        value={config.colors.background}
        onChange={(background) => onChange({ ...config, colors: { ...config.colors, background } })}
      />
      <TextField
        label="Text color"
        value={config.colors.text}
        onChange={(text) => onChange({ ...config, colors: { ...config.colors, text } })}
      />
    </Stack>
  );
}
