import type { Metadata } from 'next';
import {
  Geist,
  Instrument_Serif,
  Inter,
  Bricolage_Grotesque,
  JetBrains_Mono,
  Fraunces,
  Lora,
} from 'next/font/google';
import { loadSiteConfig } from '@/lib/content';
import { cn } from '@/lib/utils';
import { SmoothAnchorScroll } from '@/components/SmoothAnchorScroll';
import { PlausibleScript } from '@/components/PlausibleScript';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

const FONT_PAIR_VARS: Record<string, { display: string; body: string }> = {
  editorial: { display: 'var(--font-instrument-serif)', body: 'var(--font-inter)' },
  studio: { display: 'var(--font-bricolage)', body: 'var(--font-jetbrains-mono)' },
  tech: { display: 'var(--font-jetbrains-mono)', body: 'var(--font-geist)' },
  warm: { display: 'var(--font-fraunces)', body: 'var(--font-lora)' },
  monochrome: { display: 'var(--font-geist)', body: 'var(--font-geist)' },
};

const config = loadSiteConfig();

export const metadata: Metadata = {
  title: config.siteName,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pair = config.fonts?.pair ?? null;
  const pairVars = pair && FONT_PAIR_VARS[pair];

  const cssVars: React.CSSProperties = {
    '--font-display': pairVars?.display ?? config.fonts?.heading ?? 'var(--font-geist)',
    '--font-body': pairVars?.body ?? config.fonts?.body ?? 'var(--font-geist)',
  } as React.CSSProperties;

  const themePreset = config.theme?.preset;
  const appearance = config.theme?.appearance ?? 'light';

  const htmlClass = cn(
    appearance === 'dark' && 'dark',
    geist.variable,
    instrumentSerif.variable,
    inter.variable,
    bricolage.variable,
    jetbrainsMono.variable,
    fraunces.variable,
    lora.variable,
  );

  return (
    <html lang="en" data-theme={themePreset} data-appearance={appearance} className={htmlClass}>
      <body style={cssVars}>
        <SmoothAnchorScroll />
        {children}
        <PlausibleScript />
      </body>
    </html>
  );
}
