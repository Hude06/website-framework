# Design Toolkits Reference

**Purpose:** Guidance for picking visual tooling on top of (or alongside) this framework.

**Important:** This framework was rebuilt off Tailwind + shadcn deliberately. UI is now hand-rolled primitives in `lib/ui/` + CSS Modules + CSS variable tokens. **Do not add Tailwind, shadcn, base-ui, class-variance-authority, clsx, or tailwind-merge back.** The premise was that AI agents would tailor a small primitive surface per-client rather than fight a CSS framework.

---

## What ships with this framework

| Layer | What |
|---|---|
| UI primitives | 5 display + 7 form primitives in `lib/ui/` (Container, Stack, Heading, Text, Button, TextField, TextAreaField, NumberField, SelectField, ToggleField, ImageField, ArrayField) |
| Styling | CSS Modules, scoped per component. Design tokens (`--space-*`, `--text-*`, `--color-*`, etc.) declared in `app/globals.css`. |
| Themes | 5 presets (`editorial`, `studio`, `tech`, `warm`, `monochrome`) — each a bundle of color/radius overrides applied via `[data-theme="..."]` on `<html>`. |
| Fonts | 7 Google Fonts loaded by `next/font/google` in `app/layout.tsx`. Active pair determined by `site.json` `fonts.pair` field. |
| Icons | **Lucide** (`lucide-react`) — small SVG icon set, on-demand imports. |
| Motion | **Motion** (Framer Motion) — `<Reveal>`, `<Stagger>`, `<Parallax>` primitives in `lib/motion.tsx`, all reduced-motion aware. |
| Validation | **Zod** — schemas in `lib/schemas.ts` guard admin API saves. |

That's the whole UI runtime. ~6 dependencies total.

---

## When to add something

The framework intentionally has a small surface so AI agents can tailor each client site without coordinating with a CSS framework's config. Layering more on top fights that goal. Add a dependency only when:

1. **You can't build it with primitives in reasonable time** (e.g., a complex date picker, a rich text editor, a data table). Then add a focused, scoped library — don't pull in a whole component kit.
2. **The client site genuinely needs it** (e.g., a Stripe checkout button on an e-commerce client). Add it to *that* client's `client/` directory, not the framework.
3. **There's no good way to do it with CSS alone** (e.g., a charting library, a maps library).

---

## Allowed dependency categories (case-by-case)

| Need | Suggested library | Notes |
|---|---|---|
| Icons | Lucide (already in deps) | Tree-shakes well, no theme dependency |
| Animation | Motion (already in deps) | Use `lib/motion.tsx` primitives first |
| Markdown / rich text content | `react-markdown` + `rehype-*` plugins | Per-client only — add as a custom block |
| Date / time | `date-fns` | Lightweight, tree-shakes |
| Forms (complex) | Build with `<TextField>` + `<ArrayField>` first. Reach for `react-hook-form` only if validation logic gets gnarly | |
| Charts | `recharts` or `visx` | Per-client only — add as a custom block |
| Tables (interactive) | `@tanstack/react-table` headless | Per-client only |
| File upload (advanced) | `react-dropzone` | The framework's `ImageField` covers basic upload |
| Map | `maplibre-gl` or `leaflet` | Per-client only |
| Carousel / slider | `embla-carousel-react` | Headless, small |
| Confetti / micro-interactions | `canvas-confetti` | Per-client only |

---

## Forbidden additions (intentional)

- **Tailwind CSS** in any version
- **shadcn/ui**, **base-ui**, **radix-ui** primitives
- **class-variance-authority**, **clsx**, **tailwind-merge**
- **DaisyUI**, **Flowbite**, **Aceternity**, **Magic UI**, **Tremor**, **Mantine**, **Ant Design**
- **GSAP** (heavier than Motion and overlaps in capabilities)
- Any CSS-in-JS runtime (styled-components, emotion, vanilla-extract)

If you need something one of these provides, prefer:
1. Writing it as a primitive in `lib/ui/`
2. Writing it as a custom block in `client/blocks/`
3. Pulling in a single focused dependency that doesn't impose theming opinions

---

## "Break glass" — when not to use this framework at all

This framework is purpose-built for **content-as-JSON client websites with an admin panel**. Wrong tool for:

| Site type | Better tool |
|---|---|
| Documentation site | Nextra, Starlight (Astro), Docusaurus |
| Content-heavy blog / magazine (50+ articles) | Astro + content collections, or Hugo |
| E-commerce with inventory / cart | Shopify Hydrogen, Medusa, or Saleor |
| Real-time / collaborative app | Convex / Liveblocks / Yjs on a different shell |
| Internal admin tool / dashboard | Retool / Refine / Mantine |
| Static portfolio with no admin needs | Astro or plain HTML — overkill to use this framework |

Tell the user up front if they've picked the wrong tool. Don't bend this framework into something it isn't.
