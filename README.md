# Website Framework

An open-source, AI-first website framework built on Next.js + React. Designed as a lightweight WordPress alternative for developers who build client websites with Claude.

## What This Is

A reusable framework for building static-ish client websites. You scaffold a new site from this framework, customize it with Claude, deploy it to a Docker container on your server, and hand your client an admin panel where they can edit content without touching code.

## How It Works

1. **Developer scaffolds a new site** from this framework
2. **Developer customizes** the site with Claude (blocks, styling, content)
3. **Developer deploys** to a Docker container on a Linode server behind Nginx
4. **Client edits content** through an admin panel at `/admin` (text, images, pages, navigation)
5. **Changes auto-sync** to GitHub via git commit + push

## Key Features

- **Block-based content** — pages are JSON files with 10 typed base blocks (heading, text, image, button, hero, section, grid, two-column, quote, form)
- **Admin panel** at `/admin` — page editor, block gallery, nav editor, image upload, live preview iframe
- **BlockRenderer contract** — admin panel edits JSON data, blocks render it. Generic over the registry.
- **No CSS framework** — small set of hand-rolled primitives + CSS Modules + design tokens. No Tailwind, no shadcn.
- **5 theme presets** — editorial / studio / tech / warm / monochrome. Themes are CSS variable bundles applied via `[data-theme]`.
- **No database** — everything is JSON files in `/content/`
- **No auth code in the app** — Nginx basic auth protects `/admin` on the server
- **Git-backed** — content changes commit and push automatically

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm test             # jest + testing-library
npm run lint
```

Visit:
- `http://localhost:3000` — the site
- `http://localhost:3000/admin` — admin panel (block editor + preview)
- `http://localhost:3000/ui-preview` — primitive showcase with theme switcher

## Project Structure

```
app/
  (site)/              Public site (with Header + Footer)
    page.tsx           Home — loads content/pages/home.json
    [slug]/page.tsx    Dynamic pages — loads content/pages/{slug}.json
    not-found.tsx      404
  admin/               Admin panel (no site chrome)
    page.tsx           Page editor, block gallery, nav editor, settings, iframe preview
  api/admin/           API routes for content CRUD
    pages/             List, create, read, update, delete pages
    site/              Read and update site config (nav, colors, fonts)
    upload/            Image upload
    rebuild/           Trigger npm run build + git commit/push
  ui-preview/          Primitive showcase + theme switcher (dev tool)
  layout.tsx           Root layout — loads fonts, sets theme attributes
  globals.css          Design tokens + 5 theme presets

components/
  blocks/              The 10 base block render components
  admin/               Admin chrome (BlockEditor, BlockGallery, PageSidebar, etc.)
  admin/editors/       Per-block admin editors
  admin/manifests.ts   Block templates for the gallery (defaults + labels)
  BlockRenderer.tsx    Maps block.type → component, merges client + framework registry
  Header.tsx           Site header with nav links from site.json
  Footer.tsx           Site footer

lib/
  ui/                  12 primitives: Container, Stack, Heading, Text, Button,
                       TextField, TextAreaField, NumberField, SelectField,
                       ToggleField, ImageField, ArrayField (all CSS Modules)
  content.ts           loadPage(), loadSiteConfig(), listPages()
  admin.ts             Server-side helpers (write, delete, validate, git, rebuild)
  admin-api.ts         Client-side fetch wrappers
  types.ts             TypeScript types for the 10 base blocks + page + site config
  schemas.ts           Zod schemas (validate on save)
  themes.ts            Theme preset loader
  motion.tsx           Reveal / Stagger / Parallax primitives (Framer Motion)

content/
  pages/*.json         Page content files (home, about, contact)
  themes/*.json        5 theme presets
  uploads/             Client-uploaded images
  site.json            Site config (name, nav links, fonts, theme)

client/
  blocks/              Client-specific custom blocks (empty by default)
  registry.ts          Client block render components map
  editor-registry.ts   Client block admin editors map
  gallery.ts           Client block gallery entries
  types.ts             Client block TypeScript union
  theme.ts             Client theme presets map
  README.md            Client zone docs
```

## The 10 Base Blocks

| Type | Description | Key fields |
|------|-------------|-----------|
| `heading` | A standalone heading | text, level (1-6), size, tone, align |
| `text` | Body paragraphs (split on blank lines) | body, size, tone, weight, align |
| `image` | Image with optional caption | src, alt, caption, width |
| `button` | Call-to-action link | label, href, variant, size, align |
| `hero` | Title + subtitle + buttons + optional image | title, subtitle, buttons[], image, align |
| `section` | Visual band with heading + body | heading, body, background, padding, anchor |
| `grid` | N-column grid of items | heading, items[{title, body, image}], columns |
| `two-column` | Side-by-side layout | left/right: {title, body, image, button}, ratio |
| `quote` | Pull quote with author + role | quote, author, role, image |
| `form` | Contact form with configurable fields | heading, fields[{name, label, type, required}], submitLabel, action |

Need something more specific (FAQ, pricing, team grid)? Build a **custom block** in `client/blocks/` — it merges into the gallery automatically without touching framework code. See `client/README.md`.

## Content File Format

```json
{
  "title": "About",
  "slug": "about",
  "blocks": [
    { "id": "about-h1", "type": "heading", "text": "About us", "level": 1, "size": "display" },
    { "id": "about-body", "type": "text", "body": "We do things.\n\nAnd we do them well." }
  ]
}
```

## Adding a New Block Type

**Framework block** (ships to all clients — edit this repo):
1. Add the interface to `lib/types.ts`, add to `FrameworkBlock` union
2. Add the zod schema to `lib/schemas.ts`
3. Create the render component in `components/blocks/<Name>Block.tsx`
4. Register in `components/BlockRenderer.tsx`
5. Create the editor in `components/admin/editors/<Name>Editor.tsx`
6. Register in `components/admin/editors/index.ts`
7. Add the manifest to `components/admin/manifests.ts`

**Client block** (lives in one site only — edit `client/` in that site): see `client/README.md`.

## Deployment

Sites deploy as Docker containers on a Linode server behind Nginx with SSL via Certbot.

- `/admin` and `/api/admin` are protected by Nginx basic auth (no app-level auth code)
- Docker container runs Next.js in standalone mode
- Git deploy key (push-only, single repo) for content sync

See `ARCHITECTURE.md` for full deployment flow diagrams.

## Tech Stack

- **Next.js 16** — App Router, standalone output
- **React 19** — server and client components
- **Motion** — animation primitives (Reveal / Stagger / Parallax)
- **Lucide** — icon library (optional, on demand)
- **Zod** — schema validation for admin saves
- **TypeScript** — strict mode
- **Jest + Testing Library** — unit and component tests
- **Docker + Nginx** — containerized deployment with SSL

No CSS framework, no component library — UI is hand-rolled primitives + CSS Modules + CSS variables.

## License

Open source. MIT.
