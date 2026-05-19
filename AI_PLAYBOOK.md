# AI Playbook

Written for AI agents scaffolding or editing sites built on this framework. Read this before writing any JSX or JSON.

**What this framework is.** A content-as-JSON website framework on Next.js 16. Pages are JSON files (`content/pages/*.json`) composed of typed blocks. A `BlockRenderer` maps `block.type` to a React component. You never hand-roll JSX in `app/(site)/` pages — you add blocks (or build new custom ones in `client/`) and pick a theme.

**Stack:** Next.js 16, React 19, hand-rolled UI primitives in `lib/ui/`, CSS Modules, Motion (Framer) for animations, Lucide for icons. **No Tailwind. No shadcn. No CSS framework.**

## Your menu

1. **10 base blocks** — the framework primitives every client site starts with
2. **5 theme presets** — each with its own aesthetic POV and font pair
3. **12 UI primitives** — display + form, composed into blocks (or your custom blocks)
4. **Motion primitives** — `<Reveal>`, `<Stagger>`, `<Parallax>`, all reduced-motion aware
5. **Design tokens** — colors, spacing, type scale, radius, shadows (all CSS variables)
6. **Per-client customization** — add custom blocks in `client/` without touching the framework

---

## 1. Block catalogue (10 base blocks)

Every framework block lives in `components/blocks/` and has a typed interface in `lib/types.ts`. To add a block to a page, append it to the `blocks` array in a `content/pages/*.json` file. Every block requires `id` (string) and `type` (one of the strings below).

| Type | Purpose | Required fields | Key optional fields |
|---|---|---|---|
| `heading` | Section title or page heading | `text` | `level` (1-6), `size` (sm/md/lg/xl/display/hero), `tone` (default/muted/accent), `align` |
| `text` | Body paragraphs (split on blank lines) | `body` | `size` (xs/sm/base/lg/xl), `tone`, `weight` (regular/medium/semibold/bold), `align` |
| `image` | Standalone image with optional caption | `src`, `alt` | `caption`, `width` (narrow/default/wide/full) |
| `button` | Call-to-action link | `label`, `href` | `variant` (primary/secondary/ghost/accent/destructive), `size`, `align` |
| `hero` | Big intro: title + subtitle + buttons + optional image | `title` | `subtitle`, `buttons[]`, `image`, `align` |
| `section` | Visual band with background + heading + body | — | `heading`, `body`, `background` (default/muted/card/accent), `padding` (sm/md/lg/xl), `anchor` |
| `grid` | N-column grid of items (cards) | `items[]` (each with `title`, optional `body` and `image`) | `heading`, `columns` (2/3/4) |
| `two-column` | Side-by-side layout | `left`, `right` (each can have `title`, `body`, `image`, `button`) | `ratio` (50-50/60-40/40-60) |
| `quote` | Pull quote / testimonial | `quote` | `author`, `role`, `image` |
| `form` | Contact form with configurable fields | `fields[]` (each with `name`, `label`, `type`) | `heading`, `submitLabel`, `action` |

**Form field types:** `text`, `textarea`, `email`. Each field can be `required: true`.
**Button variants:** `primary`, `secondary`, `ghost`, `accent`, `destructive`.

Need something more specific (FAQ, pricing, team, stats, video)? Build a **custom block** in `client/blocks/` — see `client/README.md`. Custom blocks compose from the same UI primitives.

---

## 2. Theme presets (5 distinct aesthetic POVs)

Set the active theme in `content/site.json`:
```json
"theme": { "preset": "editorial", "appearance": "light" }
```

| Preset | Vibe | Default font pair |
|---|---|---|
| `editorial` | NYT magazine × Linear changelog. Warm paper, deep ink, terracotta accent. Hairline rules, no drop shadows. | Instrument Serif (display) + Inter (body) |
| `studio` | Neo-brutalist agency. Black/white/neon-green accent, sharp 0-radius edges, heavy lines. | Bricolage Grotesque + JetBrains Mono |
| `tech` | Terminal/dashboard. Deep blue, cyan accent, small radius. | JetBrains Mono + Geist |
| `warm` | Apothecary, hand-made. Soft cream + terracotta. Big rounded corners. | Fraunces + Lora |
| `monochrome` | Braun. Pure grayscale, minimal accent, small radius. | Geist (single family) |

Themes drive CSS variables for color (`--background`, `--foreground`, `--primary`, `--accent`, etc.) and radius. Spacing, type scale, and font weights are global tokens shared across themes.

Light/dark variant is set via `theme.appearance` (`light` / `dark` / `auto`). Not every preset has a polished dark mode — editorial, studio, warm, monochrome do.

Preview every theme by running `npm run dev` and visiting `/ui-preview` — there's a theme switcher in the top bar.

---

## 3. UI primitives (`lib/ui/`)

When building a custom block (in `client/blocks/`) or extending a framework block, **always import from `lib/ui/`** — don't reach for raw HTML elements unless you need a tag the primitives don't cover.

**Display primitives**

| Primitive | What it does | Key props |
|---|---|---|
| `<Container>` | Width-constrained wrapper with horizontal padding | `width` (narrow/default/wide/full/fluid) |
| `<Stack>` | Vertical flex column with gap | `gap` (0-24 in spacing scale), `align` |
| `<Heading>` | Semantic h1-h6 with independent visual size | `level`, `size`, `tone`, `align` |
| `<Text>` | p/span/div with theme-aware styling | `as`, `size`, `tone`, `weight`, `align` |
| `<Button>` | Button OR link (renders `<a>` if `href` is set) | `variant`, `size`, `href` (optional) |

**Form primitives** (use these inside admin editors and inside `<form>` blocks)

| Primitive | What it does |
|---|---|
| `<TextField>` | Label + single-line input + hint/error |
| `<TextAreaField>` | Label + multi-line input |
| `<NumberField>` | Label + numeric input with min/max |
| `<SelectField>` | Label + dropdown with `options: { value, label }[]` |
| `<ToggleField>` | Label + on/off switch |
| `<ImageField>` | Image preview + URL input + upload button (POSTs to `/api/admin/upload`) |
| `<ArrayField<T>>` | Add / remove / reorder list of items, with a `renderItem` callback |

All primitives consume theme tokens via CSS variables — they restyle automatically when the active theme changes. No props for color or font — those come from the active theme.

---

## 4. Design tokens (CSS variables)

Declared in `app/globals.css`. Use these in any custom CSS Module instead of hard-coded values.

| Group | Tokens |
|---|---|
| Spacing | `--space-0` … `--space-24` (numeric scale: 1=0.25rem, 2=0.5rem, 4=1rem, etc.) |
| Type scale | `--text-xs` … `--text-6xl` |
| Line height | `--leading-tight`, `--leading-snug`, `--leading-normal`, `--leading-relaxed` |
| Weights | `--weight-regular`, `--weight-medium`, `--weight-semibold`, `--weight-bold` |
| Containers | `--container-narrow`, `--container-default`, `--container-wide`, `--container-full` |
| Colors (theme) | `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--accent`, `--accent-foreground`, `--muted`, `--muted-foreground`, `--card`, `--card-foreground`, `--border`, `--input`, `--ring`, `--destructive` |
| Fonts | `--font-display`, `--font-body`, `--font-mono` |
| Radius | `--radius`, `--radius-sm`, `--radius-lg`, `--radius-full` |
| Shadow | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |

Theme presets override the **color** tokens (and `--radius`). Spacing and type are global.

---

## 5. Motion primitives (`lib/motion.tsx`)

| Primitive | Effect | Key props |
|---|---|---|
| `<Reveal>` | Fade + slide in on scroll | `direction` (up/down/left/right/none), `delay`, `duration`, `distance`, `once` |
| `<Stagger>` | Stagger children's reveals | `delay`, `gap` (between children) |
| `<Parallax>` | Translate on scroll | `speed`, `direction` |

All three respect `prefers-reduced-motion` automatically. Use sparingly — motion is seasoning, not the dish.

---

## 6. Section composition rules

- **One Hero per page**, always at the top.
- Use **Section** to introduce structural beats (heading + paragraph in a colored band). Don't put 12 sections in a row — alternate with Hero, Grid, Quote.
- **Grid** absorbs many old block types: features, services, team, stats. Set `columns` to 2/3/4 based on item count.
- **TwoColumn** is for narrative beats (image left, text right). Don't use it for 3+ columns — use Grid.
- **Quote** is high-impact — one per page maximum, near a major decision moment.
- **Form** at the end of a page or on a dedicated /contact route. Don't put a form mid-flow.

Spacing between blocks is handled by each block's own padding — don't add manual spacers.

---

## 7. Custom blocks per-client

When the 10 base blocks don't cover a client's need, build a **custom block** in `client/blocks/`. Steps:

1. `client/blocks/<Name>/<Name>Block.tsx` — render component (compose from `lib/ui`)
2. `client/blocks/<Name>/<Name>Editor.tsx` — admin form (compose from form primitives)
3. `client/blocks/<Name>/manifest.ts` — `{ type, label, description, defaults }`
4. Register in `client/registry.ts`, `client/editor-registry.ts`, `client/gallery.ts`, `client/types.ts`
5. The admin panel picks it up automatically — no framework code changes

See `client/README.md` for a full walkthrough.

---

## 8. Do / Don't

**Do:**
- Read `content/pages/home.json` for a working example before writing new pages
- Use `lib/ui` primitives in any new code; let CSS Modules + tokens do the styling
- Add custom blocks per-client when the base 10 aren't enough
- Run `/ui-preview` to validate that custom code works across all themes
- Keep block JSON additive — old content must still validate after schema changes (add new fields as optional)

**Don't:**
- Hand-roll JSX in `app/(site)/` route files — extend the block system instead
- Import Tailwind, shadcn, base-ui, class-variance-authority, clsx, tailwind-merge — they were removed deliberately
- Hardcode colors, font sizes, or spacing in component CSS — use the tokens
- Add a `Separator` block between blocks — use block padding and Section backgrounds for visual rhythm
- Skip the admin editor when adding a new block type — the client must be able to edit it
