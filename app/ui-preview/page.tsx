'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Stack,
  Heading,
  Text,
  Button,
  TextField,
  TextAreaField,
  NumberField,
  SelectField,
  ToggleField,
  ImageField,
  ArrayField,
} from '@/lib/ui';
import styles from './page.module.css';

const THEMES = ['default', 'editorial', 'studio', 'tech', 'warm', 'monochrome'] as const;
type Theme = typeof THEMES[number];

const APPEARANCES = ['light', 'dark'] as const;
type Appearance = typeof APPEARANCES[number];

interface FormState {
  text: string;
  body: string;
  count: number;
  variant: 'primary' | 'secondary' | 'ghost';
  enabled: boolean;
  image: string;
  links: { label: string; href: string }[];
}

export default function UiPreviewPage() {
  const [theme, setTheme] = useState<Theme>('default');
  const [appearance, setAppearance] = useState<Appearance>('light');
  const [form, setForm] = useState<FormState>({
    text: 'Hello world',
    body: 'A multi-line text area sample.\nSecond line.',
    count: 3,
    variant: 'primary',
    enabled: true,
    image: '',
    links: [
      { label: 'Get started', href: '/start' },
      { label: 'Docs', href: '/docs' },
    ],
  });
  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'default') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', theme);
    }
    html.setAttribute('data-appearance', appearance);
    if (appearance === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme, appearance]);

  return (
    <div className={styles.page}>
      <div className={styles.themeBar}>
        <Container width="full">
          <div className={styles.themeBarInner}>
            <span className={styles.themeBarLabel}>Theme</span>
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`${styles.themeButton} ${theme === t ? styles.themeButtonActive : ''}`}
              >
                {t}
              </button>
            ))}
            <span className={styles.themeBarLabel} style={{ marginLeft: 'var(--space-4)' }}>Mode</span>
            {APPEARANCES.map((a) => (
              <button
                key={a}
                onClick={() => setAppearance(a)}
                className={`${styles.themeButton} ${appearance === a ? styles.themeButtonActive : ''}`}
              >
                {a}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container width="wide">
        <Stack gap={2}>
          <Heading level={1} size="hero">UI Primitives</Heading>
          <Text size="lg" tone="muted">
            5 building blocks. Everything visual in the framework composes from these.
          </Text>
        </Stack>

        {/* ============================================================ */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Container</div>
          <Heading level={2} size="lg">Width variants</Heading>
          <Stack gap={3} style={{ marginTop: 'var(--space-6)' }}>
            <div>
              <Container width="narrow">
                <div className={styles.containerDemo}>narrow — 672px</div>
              </Container>
            </div>
            <div>
              <Container width="default">
                <div className={styles.containerDemo}>default — 768px</div>
              </Container>
            </div>
            <div>
              <Container width="wide">
                <div className={styles.containerDemo}>wide — 1024px</div>
              </Container>
            </div>
            <div>
              <Container width="full">
                <div className={styles.containerDemo}>full — 1280px</div>
              </Container>
            </div>
          </Stack>
        </section>

        {/* ============================================================ */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Stack</div>
          <Heading level={2} size="lg">Gap sizes (1, 2, 4, 6, 8, 12)</Heading>
          <div className={styles.gridDemo} style={{ marginTop: 'var(--space-6)' }}>
            {[1, 2, 4, 6, 8, 12].map((gap) => (
              <Stack key={gap} gap={gap as 1 | 2 | 4 | 6 | 8 | 12}>
                <div className={styles.swatchBox}>gap={gap}</div>
                <div className={styles.swatchBox}>item</div>
                <div className={styles.swatchBox}>item</div>
              </Stack>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Heading</div>
          <Heading level={2} size="lg">Sizes</Heading>
          <Stack gap={4} style={{ marginTop: 'var(--space-6)' }}>
            <Heading level={1} size="hero">Hero — the quick brown fox</Heading>
            <Heading level={1} size="display">Display — the quick brown fox</Heading>
            <Heading level={2} size="xl">XL — the quick brown fox</Heading>
            <Heading level={3} size="lg">LG — the quick brown fox</Heading>
            <Heading level={4} size="md">MD — the quick brown fox</Heading>
            <Heading level={5} size="sm">SM — the quick brown fox</Heading>
          </Stack>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionLabel}>Heading · tones + alignment</div>
          <Stack gap={3} style={{ marginTop: 'var(--space-6)' }}>
            <Heading level={3} size="lg" tone="default">Default tone</Heading>
            <Heading level={3} size="lg" tone="muted">Muted tone</Heading>
            <Heading level={3} size="lg" tone="accent">Accent tone</Heading>
            <Heading level={3} size="lg" align="center">Centered heading</Heading>
            <Heading level={3} size="lg" align="right">Right-aligned heading</Heading>
          </Stack>
        </section>

        {/* ============================================================ */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Text</div>
          <Heading level={2} size="lg">Sizes</Heading>
          <Stack gap={3} style={{ marginTop: 'var(--space-6)' }}>
            <Text size="xl">XL — Plain prose feels lighter when the line height breathes a little.</Text>
            <Text size="lg">LG — Plain prose feels lighter when the line height breathes a little.</Text>
            <Text size="base">Base — Plain prose feels lighter when the line height breathes a little.</Text>
            <Text size="sm">SM — Plain prose feels lighter when the line height breathes a little.</Text>
            <Text size="xs">XS — Plain prose feels lighter when the line height breathes a little.</Text>
          </Stack>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionLabel}>Text · tones + weights</div>
          <Stack gap={3} style={{ marginTop: 'var(--space-6)' }}>
            <Text tone="default">Default tone — the quick brown fox jumps over the lazy dog.</Text>
            <Text tone="muted">Muted tone — the quick brown fox jumps over the lazy dog.</Text>
            <Text tone="accent">Accent tone — the quick brown fox jumps over the lazy dog.</Text>
            <Text weight="regular">Regular weight</Text>
            <Text weight="medium">Medium weight</Text>
            <Text weight="semibold">Semibold weight</Text>
            <Text weight="bold">Bold weight</Text>
          </Stack>
        </section>

        {/* ============================================================ */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Button</div>
          <Heading level={2} size="lg">Variants × sizes</Heading>
          <Stack gap={4} style={{ marginTop: 'var(--space-6)' }}>
            <div className={styles.swatchRow}>
              <Button variant="primary" size="sm">Primary sm</Button>
              <Button variant="primary" size="md">Primary md</Button>
              <Button variant="primary" size="lg">Primary lg</Button>
            </div>
            <div className={styles.swatchRow}>
              <Button variant="secondary" size="sm">Secondary sm</Button>
              <Button variant="secondary" size="md">Secondary md</Button>
              <Button variant="secondary" size="lg">Secondary lg</Button>
            </div>
            <div className={styles.swatchRow}>
              <Button variant="ghost" size="sm">Ghost sm</Button>
              <Button variant="ghost" size="md">Ghost md</Button>
              <Button variant="ghost" size="lg">Ghost lg</Button>
            </div>
            <div className={styles.swatchRow}>
              <Button variant="accent" size="md">Accent</Button>
              <Button variant="destructive" size="md">Destructive</Button>
              <Button variant="primary" size="md" disabled>Disabled</Button>
              <Button variant="primary" size="md" href="#">As link</Button>
            </div>
          </Stack>
        </section>

        {/* ============================================================ */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Form primitives (used by admin editors)</div>
          <Heading level={2} size="lg">Form fields</Heading>
          <div style={{ marginTop: 'var(--space-6)', display: 'grid', gridTemplateColumns: 'minmax(0, 480px)', gap: 'var(--space-5)' }}>
            <TextField
              label="Text field"
              hint="A single-line input"
              value={form.text}
              onChange={(v) => setField('text', v)}
              placeholder="Type something…"
            />
            <TextAreaField
              label="Text area"
              hint="Multi-line input"
              value={form.body}
              onChange={(v) => setField('body', v)}
              rows={3}
            />
            <NumberField
              label="Number field"
              hint="Integer with min/max"
              value={form.count}
              onChange={(v) => setField('count', v)}
              min={1}
              max={10}
            />
            <SelectField
              label="Select field"
              hint="Dropdown of options"
              value={form.variant}
              onChange={(v) => setField('variant', v)}
              options={[
                { value: 'primary', label: 'Primary' },
                { value: 'secondary', label: 'Secondary' },
                { value: 'ghost', label: 'Ghost' },
              ]}
            />
            <ToggleField
              label="Toggle field"
              hint="A boolean switch"
              value={form.enabled}
              onChange={(v) => setField('enabled', v)}
            />
            <ImageField
              label="Image field"
              hint="Upload or paste URL"
              value={form.image}
              onChange={(v) => setField('image', v)}
            />
            <ArrayField
              label="Array field (links)"
              hint="Add, remove, reorder"
              items={form.links}
              onChange={(items) => setField('links', items)}
              createItem={() => ({ label: 'New link', href: '/' })}
              itemLabel={(item, i) => item.label || `Link ${i + 1}`}
              renderItem={(item, _i, update) => (
                <Stack gap={3}>
                  <TextField label="Label" value={item.label} onChange={(v) => update({ ...item, label: v })} />
                  <TextField label="Href" value={item.href} onChange={(v) => update({ ...item, href: v })} />
                </Stack>
              )}
            />
          </div>
        </section>

        {/* ============================================================ */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Composition example</div>
          <Heading level={2} size="lg">A hero composed from primitives</Heading>
          <div style={{ marginTop: 'var(--space-8)', padding: 'var(--space-12) var(--space-6)', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <Container width="default">
              <Stack gap={6} align="center">
                <Heading level={1} size="display" align="center">
                  Build websites the AI way.
                </Heading>
                <Text size="xl" tone="muted" align="center">
                  A small set of primitives. Themes that just work. No CSS framework, no class soup.
                </Text>
                <div className={styles.swatchRow} style={{ justifyContent: 'center' }}>
                  <Button variant="primary" size="lg">Get started</Button>
                  <Button variant="ghost" size="lg">Learn more</Button>
                </div>
              </Stack>
            </Container>
          </div>
        </section>
      </Container>
    </div>
  );
}
