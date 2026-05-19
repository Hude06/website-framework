import editorial from '../content/themes/editorial.json';
import studio from '../content/themes/studio.json';
import tech from '../content/themes/tech.json';
import warm from '../content/themes/warm.json';
import monochrome from '../content/themes/monochrome.json';

export type ThemePresetName = string;

export type FontPairName = 'editorial' | 'studio' | 'tech' | 'warm' | 'monochrome';

export interface ThemeColors {
  bg: string;
  fg: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  card: string;
  cardForeground: string;
}

export interface ThemeShadow {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeMotion {
  duration: number;
  ease: string;
  stagger: number;
  character: 'snappy' | 'smooth' | 'spring' | 'linear' | 'elastic';
}

export interface ThemePreset {
  name: ThemePresetName;
  label: string;
  description: string;
  colors: ThemeColors;
  colorsDark?: Partial<ThemeColors>;
  radius: string;
  shadow: ThemeShadow;
  fontPair: FontPairName;
  motion: ThemeMotion;
  atmosphere?: string;
}

/** The 5 framework theme presets. Consumers can merge their own
   `clientThemes` map before passing to `listThemes` / `loadTheme`. */
export const frameworkThemes: Record<string, ThemePreset> = {
  editorial: editorial as ThemePreset,
  studio: studio as ThemePreset,
  tech: tech as ThemePreset,
  warm: warm as ThemePreset,
  monochrome: monochrome as ThemePreset,
};

export function listThemes(registry: Record<string, ThemePreset> = frameworkThemes): ThemePresetName[] {
  return Object.keys(registry);
}

export function loadTheme(
  name: ThemePresetName,
  registry: Record<string, ThemePreset> = frameworkThemes,
): ThemePreset {
  const theme = registry[name];
  if (!theme) {
    throw new Error(`Unknown theme preset: ${name}`);
  }
  return theme;
}

export function themeToCssVars(preset: ThemePreset): Record<string, string> {
  const { colors, shadow, radius } = preset;
  return {
    '--color-bg': colors.bg,
    '--color-fg': colors.fg,
    '--color-primary': colors.primary,
    '--color-primary-foreground': colors.primaryForeground,
    '--color-accent': colors.accent,
    '--color-accent-foreground': colors.accentForeground,
    '--color-muted': colors.muted,
    '--color-muted-foreground': colors.mutedForeground,
    '--color-border': colors.border,
    '--color-card': colors.card,
    '--color-card-foreground': colors.cardForeground,
    '--radius': radius,
    '--shadow-sm': shadow.sm,
    '--shadow-md': shadow.md,
    '--shadow-lg': shadow.lg,
    '--shadow-xl': shadow.xl,
  };
}

export function themeToDarkCssVars(preset: ThemePreset): Record<string, string> {
  if (!preset.colorsDark) return {};
  const vars: Record<string, string> = {};
  const dark = preset.colorsDark;
  if (dark.bg) vars['--color-bg'] = dark.bg;
  if (dark.fg) vars['--color-fg'] = dark.fg;
  if (dark.primary) vars['--color-primary'] = dark.primary;
  if (dark.primaryForeground) vars['--color-primary-foreground'] = dark.primaryForeground;
  if (dark.accent) vars['--color-accent'] = dark.accent;
  if (dark.accentForeground) vars['--color-accent-foreground'] = dark.accentForeground;
  if (dark.muted) vars['--color-muted'] = dark.muted;
  if (dark.mutedForeground) vars['--color-muted-foreground'] = dark.mutedForeground;
  if (dark.border) vars['--color-border'] = dark.border;
  if (dark.card) vars['--color-card'] = dark.card;
  if (dark.cardForeground) vars['--color-card-foreground'] = dark.cardForeground;
  return vars;
}
