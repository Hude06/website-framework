import { z } from 'zod';

const safeUrl = z
  .string()
  .max(2048)
  .refine((s) => {
    if (s.startsWith('/') && !s.startsWith('//')) return true;
    if (s.startsWith('#')) return true;
    if (s.startsWith('mailto:') || s.startsWith('tel:')) return true;
    try {
      const u = new URL(s);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Invalid URL: must be relative, http(s), mailto:, tel:, or fragment');

const imageSrc = z
  .string()
  .max(2048)
  .refine((s) => {
    if (s === '') return true;
    if (s.startsWith('/') && !s.startsWith('//')) return true;
    try {
      const u = new URL(s);
      return u.protocol === 'http:' || u.protocol === 'https:' || u.protocol === 'data:';
    } catch {
      return false;
    }
  }, 'Invalid image src: must be relative or http(s)/data:');

const shortText = z.string().max(500);
const mediumText = z.string().max(2000);
const longText = z.string().max(20000);
const hexColor = z.string().regex(/^#([0-9a-fA-F]{3,8})$/, 'Must be a hex color');
const fontFamily = z.string().max(200);
const id = z.string().min(1).max(200);

const headingLevel = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]);
const headingSize = z.enum(['sm', 'md', 'lg', 'xl', 'display', 'hero']);
const textSize = z.enum(['xs', 'sm', 'base', 'lg', 'xl']);
const tone = z.enum(['default', 'muted', 'accent']);
const weight = z.enum(['regular', 'medium', 'semibold', 'bold']);
const align = z.enum(['left', 'center', 'right']);
const buttonVariant = z.enum(['primary', 'secondary', 'ghost', 'accent', 'destructive']);
const buttonSize = z.enum(['sm', 'md', 'lg']);
const imageWidth = z.enum(['narrow', 'default', 'wide', 'full']);
const sectionBackground = z.enum(['default', 'muted', 'card', 'accent']);
const sectionPadding = z.enum(['sm', 'md', 'lg', 'xl']);
const gridColumns = z.union([z.literal(2), z.literal(3), z.literal(4)]);
const columnRatio = z.enum(['50-50', '60-40', '40-60']);
const formFieldType = z.enum(['text', 'textarea', 'email']);

const ctaLink = z.object({
  label: shortText,
  href: safeUrl,
  variant: buttonVariant.optional(),
});

const gridItem = z.object({
  title: shortText,
  body: mediumText.optional(),
  image: imageSrc.optional(),
});

const columnSide = z.object({
  title: shortText.optional(),
  body: mediumText.optional(),
  image: imageSrc.optional(),
  button: ctaLink.optional(),
});

const formField = z.object({
  name: z.string().min(1).max(100).regex(/^[a-zA-Z_][a-zA-Z0-9_-]*$/, 'Invalid field name'),
  label: shortText,
  type: formFieldType,
  required: z.boolean().optional(),
  placeholder: shortText.optional(),
});

/* ============================================================
   Block schemas — the 10 base blocks
   ============================================================ */
const HeadingBlockSchema = z.object({
  id, type: z.literal('heading'),
  text: shortText,
  level: headingLevel.optional(),
  size: headingSize.optional(),
  tone: tone.optional(),
  align: align.optional(),
});

const TextBlockSchema = z.object({
  id, type: z.literal('text'),
  body: longText,
  size: textSize.optional(),
  tone: tone.optional(),
  weight: weight.optional(),
  align: align.optional(),
});

const ImageBlockSchema = z.object({
  id, type: z.literal('image'),
  src: imageSrc,
  alt: shortText,
  caption: shortText.optional(),
  width: imageWidth.optional(),
});

const ButtonBlockSchema = z.object({
  id, type: z.literal('button'),
  label: shortText,
  href: safeUrl,
  variant: buttonVariant.optional(),
  size: buttonSize.optional(),
  align: align.optional(),
});

const HeroBlockSchema = z.object({
  id, type: z.literal('hero'),
  title: shortText,
  subtitle: mediumText.optional(),
  buttons: z.array(ctaLink).max(4).optional(),
  image: imageSrc.optional(),
  align: align.optional(),
});

const SectionBlockSchema = z.object({
  id, type: z.literal('section'),
  heading: shortText.optional(),
  body: mediumText.optional(),
  background: sectionBackground.optional(),
  padding: sectionPadding.optional(),
  anchor: z.string().max(100).optional(),
});

const GridBlockSchema = z.object({
  id, type: z.literal('grid'),
  heading: shortText.optional(),
  items: z.array(gridItem).max(20),
  columns: gridColumns.optional(),
});

const TwoColumnBlockSchema = z.object({
  id, type: z.literal('two-column'),
  left: columnSide,
  right: columnSide,
  ratio: columnRatio.optional(),
});

const QuoteBlockSchema = z.object({
  id, type: z.literal('quote'),
  quote: mediumText,
  author: shortText.optional(),
  role: shortText.optional(),
  image: imageSrc.optional(),
});

const FormBlockSchema = z.object({
  id, type: z.literal('form'),
  heading: shortText.optional(),
  fields: z.array(formField).max(20),
  submitLabel: shortText.optional(),
  action: safeUrl.optional(),
});

const FrameworkBlockSchema = z.discriminatedUnion('type', [
  HeadingBlockSchema,
  TextBlockSchema,
  ImageBlockSchema,
  ButtonBlockSchema,
  HeroBlockSchema,
  SectionBlockSchema,
  GridBlockSchema,
  TwoColumnBlockSchema,
  QuoteBlockSchema,
  FormBlockSchema,
]);

const ClientBlockSchema = z.object({ id, type: z.string() }).passthrough();
const BlockSchema = z.union([FrameworkBlockSchema, ClientBlockSchema]);

export const PageContentSchema = z.object({
  title: shortText,
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and dashes only').max(100),
  description: mediumText.optional(),
  blocks: z.array(BlockSchema).max(200),
});

export const SiteConfigSchema = z.object({
  siteName: shortText,
  nav: z.array(z.object({ label: shortText, href: safeUrl })).max(20),
  fonts: z.object({
    heading: fontFamily,
    body: fontFamily,
    pair: z.enum(['editorial', 'studio', 'tech', 'warm', 'monochrome']).optional(),
  }),
  colors: z.object({
    primary: hexColor,
    secondary: hexColor,
    background: hexColor,
    text: hexColor,
  }),
  theme: z.object({
    preset: z.enum(['editorial', 'studio', 'tech', 'warm', 'monochrome']).optional(),
    appearance: z.enum(['light', 'dark', 'auto']).optional(),
    accent: hexColor.optional(),
  }).optional(),
  motion: z.object({
    intensity: z.enum(['none', 'subtle', 'rich']).optional(),
  }).optional(),
  contact: z.object({
    email: z.string().email().max(200).optional(),
  }).optional(),
  plausible: z.object({
    domain: z.string().max(200).optional(),
  }).optional(),
});

export type PageContentInput = z.infer<typeof PageContentSchema>;
export type SiteConfigInput = z.infer<typeof SiteConfigSchema>;
