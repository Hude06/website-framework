@AGENTS.md

# Website Framework

This is a reusable website framework. Sites built from this framework share the same architecture.

## Architecture

- Pages are JSON files in `/content/pages/` rendered by `BlockRenderer`
- Site config (nav, fonts, colors, theme) is in `/content/site.json`
- Admin panel at `/admin` lets clients edit content without code access
- See `ARCHITECTURE.md` for full system diagrams and deployment flows

## AI Playbook — READ BEFORE WRITING BLOCK JSON

Before adding, composing, or editing any block JSON, read `AI_PLAYBOOK.md` at the repo root. It's the menu of every block type (10 base blocks), theme preset (5 distinct aesthetic POVs), motion primitive (`<Reveal>`, `<Stagger>`, `<Parallax>`), and section composition rule available in this framework.

## UI Primitives — READ BEFORE BUILDING CUSTOM COMPONENTS

The framework has NO CSS framework. UI is built from 12 hand-rolled primitives in `lib/ui/` + CSS Modules + CSS variables (design tokens defined in `app/globals.css`).

**Display primitives**: `<Container>`, `<Stack>`, `<Heading>`, `<Text>`, `<Button>`
**Form primitives** (used by admin editors): `<TextField>`, `<TextAreaField>`, `<NumberField>`, `<SelectField>`, `<ToggleField>`, `<ImageField>` (with upload), `<ArrayField>` (with reorder)

All primitives consume theme tokens via CSS variables — they re-style automatically when the active theme changes. See `/ui-preview` route at runtime to see them across all 5 themes.

**Do not introduce Tailwind, shadcn, or any other CSS framework.** The framework was specifically rebuilt off them to keep the surface small and AI-tailorable per client.

Never hand-roll custom JSX in `app/(site)/` pages — always go through the block system. If the primitives don't cover what you need, add a new block type (see below) rather than writing one-off JSX.

## Content System

- `lib/content.ts` — `loadPage(slug)`, `loadSiteConfig()`, `listPages()`
- `lib/types.ts` — all block types, `PageContent`, `SiteConfig`, `ApiResponse`
- `lib/schemas.ts` — zod schemas; the admin API validates against these before saving
- `components/BlockRenderer.tsx` — maps `block.type` to components via registry pattern
- Content is never in components. Components read from JSON. Admin writes JSON.

## Adding a Block Type

There are two paths depending on whether the block belongs in the framework or is client-specific. Check zone rules below before picking a path.

### Framework block (ships to all clients, requires editing the framework repo)

1. Add the interface to `lib/types.ts`, add to `FrameworkBlock` union
2. Add the zod schema to `lib/schemas.ts`, add it to `FrameworkBlockSchema`
3. Create the render component in `components/blocks/<Name>Block.tsx` (+ optional `.module.css`)
4. Register in `components/BlockRenderer.tsx` (`frameworkBlocks` object)
5. Create editor in `components/admin/editors/<Name>Editor.tsx`
6. Register in `components/admin/editors/index.ts` (`frameworkEditors`)
7. Add manifest (defaults + label) to `components/admin/manifests.ts`

### Client block (lives only in a specific client site, goes in `client/`)

See `client/README.md` for the complete walkthrough. Summary: create `client/blocks/<Name>/<Name>Block.tsx` + `<Name>Editor.tsx` + `manifest.ts`, then register them in `client/registry.ts`, `client/editor-registry.ts`, and `client/gallery.ts`. Add the type to `client/types.ts`.

## Admin Panel

- `/admin` — three-pane page editor (page list | block editor | iframe preview)
- `/api/admin/pages` — CRUD for pages
- `/api/admin/site` — read/update site config
- `/api/admin/upload` — image upload to `/public/uploads/`
- `/api/admin/rebuild` — triggers `npm run build` + git commit/push
- Auth is handled by Nginx basic auth, not application code

## Skills

- `/website-init` — scaffold a new client site from this framework. Run in an empty directory. See `.claude/skills/website-init/SKILL.md`
- `/deploy-init` — first-time deployment wizard. Sets up Docker, Nginx, SSL, admin auth, deploy key. See `.claude/skills/deploy-init/SKILL.md`
- `/deploy` — repeatable deploy for code updates. Pulls remote, pushes local, rebuilds in container, health checks with auto-rollback. See `.claude/skills/deploy/SKILL.md`

## Safe to Change (Admin Panel Keeps Working)

These changes are safe and will not break the admin panel:

- **Component styling** — CSS Module rules, CSS variable tokens, theme JSON. The admin panel never touches rendering.
- **Component structure** — how HeadingBlock renders its text, how GridBlock lays out items, etc. As long as the component still reads `block.text`, `block.src`, etc., it's fine.
- **Layout and site chrome** — Header, Footer, root layout, fonts. All driven by `content/site.json`.
- **Add new pages** — through the admin panel or manually via `content/pages/*.json`.
- **Add new fields to existing blocks** as optional — e.g., add an optional `align?: 'left' | 'center'` to HeadingBlock. Old content files still work. Admin editor can be updated to expose the new field.
- **Customize the starter content** — overwrite home.json, about.json, contact.json with client-specific content.
- **Modify API route implementations** — as long as the response shape (`ApiResponse<T>`) stays the same.
- **Add new API routes** — for custom functionality like contact forms, analytics, etc.
- **Add new theme presets** — add a JSON file to `content/themes/` and a matching `[data-theme="..."]` block to `app/globals.css`.

## Breaks Admin Panel (Handle With Care)

These changes WILL break the admin panel unless you update multiple files in sync:

- **Renaming a block type** — e.g., `heading` → `title`. You MUST update:
  1. `lib/types.ts` — the type name + union
  2. `lib/schemas.ts` — the zod literal + discriminated union
  3. `components/BlockRenderer.tsx` — the registry key
  4. `components/admin/editors/index.ts` — the registry key
  5. `components/admin/manifests.ts` — the manifest type field
  6. All existing `content/pages/*.json` files that use the old name — migrate them

- **Changing field names on a block** — e.g., HeadingBlock `text` → `content`. You MUST update:
  1. `lib/types.ts` — the interface
  2. `lib/schemas.ts` — the zod field
  3. `components/blocks/HeadingBlock.tsx` — the component reads this field
  4. `components/admin/editors/HeadingEditor.tsx` — the editor writes this field
  5. `components/admin/manifests.ts` — the default value
  6. All existing content JSON using the old field name

- **Changing the ApiResponse envelope** — `lib/admin-api.ts` assumes `{success, data?, error?}`. Changing this breaks every admin fetch.

- **Removing a block editor without removing the block type** — the block will render on the site but the admin panel has no way to edit it.

- **Changing slug regex `^[a-z0-9-]+$`** — the server and admin UI both validate slugs. Change one without the other and you get cryptic errors.

- **Changing `/content/` directory structure** — `lib/content.ts` hardcodes `content/pages/` and `content/site.json`. Moving these breaks the loader.

- **Adding a top-level CSS framework** — primitives use CSS Modules and CSS variables. Mixing in Tailwind/etc. will fight the token system and cause specificity wars.

## Zone Rules (Framework vs. Client)

This repo is organized into two zones. Which files you can edit depends on whether you are in the **framework repo** or a **client site**.

### Client sites

A client site has `.client-site` at the repo root (created by `website-init`). In a client site:

- **Editable (client zone):**
  - `client/**` — custom blocks, custom editors, custom themes, gallery registrations, block type extensions
  - `content/pages/*.json` — page content
  - `content/site.json` — nav, fonts, colors, theme
  - `public/uploads/**` — client-uploaded images
- **Read-only (framework zone):** everything else (`app/`, `components/`, `lib/`, `middleware.ts`, `next.config.ts`, `Dockerfile`, `nginx.conf`, `content/themes/`, framework docs).

### Framework repo

The framework repo has NO `.client-site` marker. In the framework repo:

- **Editable (framework zone):** everything that is framework-owned.
- **Frozen (client zone):** `client/registry.ts`, `client/editor-registry.ts`, `client/gallery.ts`, `client/types.ts`, `client/theme.ts` — these stubs were committed once in Phase 1 and MUST NOT be edited again. Clients overwrite these files; editing them upstream causes a merge conflict in every client site on `sync-framework`.
- Only `client/README.md`, `client/blocks/.gitkeep`, and `client/themes/.gitkeep` are framework-editable inside `client/`.

### Guardrails

Two layers enforce the zone split:
1. **Pre-commit git hook** (`scripts/check-zones.sh`, installed by `npm install` via `scripts/install-hooks.sh`) — blocks commits that cross zones.
2. **Claude Code PreToolUse hook** (`scripts/claude-zone-guard.sh`, wired up in `.claude/settings.json`) — blocks Edit/Write/MultiEdit calls against cross-zone files at tool-call time.

Escape hatch: `FRAMEWORK_EDIT=1 <command>` disables both guards for that invocation. Use only for emergency patches — edits with this flag may conflict on future framework updates.

## Framework/Client Update Model

When `/website-init` runs, it clones the framework and sets up a `framework` git remote pointing at https://github.com/Hude06/website-framework. Each client site is an independent fork that can pull framework updates cleanly because the zone split guarantees edits never overlap.

- To pull framework updates into a client site: `npm run sync-framework` (runs `scripts/sync-framework.sh`).
- Framework updates flow only into framework-zone files.
- Client customizations live entirely in `client/`, `content/pages/`, `content/site.json`, `public/uploads/` — untouched by updates.
- Merge conflicts are prevented by the guardrail hooks on both sides.

## Key Conventions

- No database — everything is JSON files
- No hardcoded content in components — always read from `/content/`
- BlockRenderer is the contract between content and presentation
- Admin panel edits data, never touches rendering/styling
- `output: 'standalone'` in next.config — not static export
- Slugs must match `^[a-z0-9-]+$`
- Immutable updates — never mutate content objects
- All CSS uses tokens (CSS variables) — never hardcode colors, spacing, or font sizes in components
