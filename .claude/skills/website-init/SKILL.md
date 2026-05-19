---
name: website-init
description: Scaffold a new client website from the website-framework repo. Creates a private GitHub repo, customizes starter content, installs dependencies, and pushes first commit. Run this in an empty directory to start a new client site.
---

# Website Init

Scaffold a new client website from the `Hude06/website-framework` GitHub repo.

## When to Activate

- Developer types `/website-init`
- Developer says "new site", "scaffold a site", "start a new client website", "init a website"

## Required Reading — After Step 1 (Clone), Before Step 2 (Content)

The framework root only exists after Step 1 clones it. As soon as the clone lands, read these three files in the new working directory before doing any content customization:

1. `CLAUDE.md` — zone rules (what you can/can't edit), the block system contract, and the "Safe to Change" vs "Breaks Admin Panel" reference. Read this first.
2. `AI_PLAYBOOK.md` — the menu of 10 base blocks, 5 theme presets, 12 UI primitives, design tokens, do/don't list.
3. `DESIGN_TOOLKITS.md` — when this framework is the right tool (and when to break glass to Nextra/Astro/etc.).

The framework ships with hand-rolled UI primitives in `lib/ui/` + CSS Modules + CSS variable tokens. **Do NOT add Tailwind, shadcn, or any other CSS framework.** UI customization happens entirely through:
- Picking one of 5 theme presets (`editorial`, `studio`, `tech`, `warm`, `monochrome`) in `site.json`
- Composing pages from the 10 base blocks (heading, text, image, button, hero, section, grid, two-column, quote, form)
- Adding custom blocks per-client in `client/blocks/` for anything the base 10 don't cover (see `client/README.md`)

The 5 theme presets — match the client's vibe to one of these:
- **editorial** — NYT magazine × Linear changelog. Warm paper + deep ink + terracotta accent, hairline rules, no shadows. Default for personal portfolios, agency sites, editorial brands.
- **studio** — Neo-brutalist. Black/white/neon-green accent, 0-radius edges, heavy lines. Good for design studios, creative agencies.
- **tech** — Terminal/dashboard. Deep blue + cyan accent, tight radius. Developer tools, B2B SaaS.
- **warm** — Apothecary, hand-made. Soft cream + terracotta, big rounded corners. Restaurants, wellness brands, lifestyle.
- **monochrome** — Braun. Pure grayscale, minimal accent. Architecture, photography, anything where the work is the brand.

If `DESIGN_TOOLKITS.md` says the project should **"break glass"** (e.g., docs should use Nextra, not this framework), STOP and ask the user: "This framework is Next.js with a JSON block system, but for a {site type} I'd recommend {alternative} instead. Do you want me to: (a) use {alternative}, (b) force-fit this framework anyway, or (c) help you pick?"

Never hand-roll custom JSX inside `app/(site)/` pages. Always use the block system. If a block type doesn't exist for what you need, add a new client-specific block (see `client/README.md`) rather than editing framework files.

## Security Rules — READ FIRST

These rules are non-negotiable. Violating any of them is a critical failure.

1. **NEVER display, log, commit, or store** SSH keys, GitHub tokens, passwords, or any secrets
2. **NEVER use raw GitHub API calls with tokens** — always use the `gh` CLI
3. **NEVER SSH to any remote server** — this skill is LOCAL ONLY
4. **NEVER put secrets in deploy.json** — only file paths and non-secret config
5. **NEVER put secrets in any file that gets committed to git**
6. **Before displaying command output**, scan for token patterns (strings starting with `ghp_`, `gho_`, `ssh-`, `-----BEGIN`) and redact them
7. **deploy.json references key paths** (e.g., `~/.ssh/id_ed25519`), never contains the key itself

## Preflight Checks

Run these BEFORE asking any questions. If any fail, show the error and STOP.

1. **Check tools exist:**
   ```
   which gh && which npm && which git
   ```
   If any missing: "Required tool not found: {tool}. Install it and try again."

2. **Check GitHub auth:**
   ```
   gh auth status
   ```
   If not authenticated: "GitHub CLI is not authenticated. Run `! gh auth login` and try again."
   If authenticated: show which account is active, ask developer to confirm it's correct.

3. **Detect environment:**

   Check if the framework is already present by looking for `package.json` with `"name": "website-framework"`:
   
   - **Framework already here:** The developer cloned the framework manually. Do NOT `rm -rf .git` — we need to keep the git history so future framework merges have a common ancestor. Instead, rename the origin to `framework` in Step 1.
   - **Empty directory:** Will need to clone the framework first. Use a full clone (NOT `--depth 1`) for the same reason — merge needs history.
   - **Non-empty directory without framework:** Warn "This directory has files but doesn't look like the website-framework. /website-init works in either an empty directory or a freshly cloned framework. Proceed anyway?" If denied: STOP.

## Information Gathering

Ask ALL of these in a single message. Do not ask one at a time.

**Required:**
- **Site name** — the display name (e.g., "Jane's Photography")
- **Client name** — kebab-case identifier used for repo name and package name (e.g., "jane-photography"). Must match `^[a-z0-9-]+$`. Suggest one derived from the site name.
- **Site type** — one of: portfolio, agency, restaurant, service business, blog, landing page, e-commerce, other. This drives both theme choice and starter content. (If "other", ask for a one-line description of what the site is.)
- **Theme preset** — one of `editorial`, `studio`, `tech`, `warm`, `monochrome`. Suggest a default based on the site type (e.g., warm → restaurant; editorial → portfolio/agency; tech → developer tools; studio → design studio; monochrome → photography). The dev can override.

**Optional (provide defaults):**
- **Domain** — production domain if known (e.g., "janephotography.com"). Default: blank.
- **Contact email** — client's email for the contact page. Default: "hello@example.com"
- **Description** — one-line site description. Default: derived from site name.

The GitHub repo will be named `{clientName}-site` (e.g., `jane-photography-site`). Mention this to the developer.

## Execution Steps

After gathering info, execute these steps in order. Show progress for each step.

### Step 1: Get Framework (preserves history for future merges)

The client site needs `framework` as a git remote so `npm run sync-framework` can pull updates. Do NOT delete `.git` — we need the commit history so merges have a common ancestor.

**If the framework is already in the directory** (detected in preflight):
```bash
# Rename the framework clone's origin to 'framework'
git remote rename origin framework 2>/dev/null || git remote add framework https://github.com/Hude06/website-framework.git
git fetch framework
```

**If the directory is empty:**
```bash
gh repo clone Hude06/website-framework .
git remote rename origin framework
git fetch framework
```
No `--depth 1` — the merge base needs full history.

### Step 1b: Mark this as a client site

```bash
touch .client-site
```

This file is the marker that activates the zone guardrail — Claude Code and pre-commit hooks will refuse edits to framework-zone files while this file exists at the repo root. See `CLAUDE.md` § "Zone Rules".

The framework's `.gitignore` already excludes `.client-site` so it won't accidentally land upstream. It does get committed to the CLIENT repo though — you want to force-add it:

```bash
git add -f .client-site
```

### Step 2: Customize Content Files

The framework ships with **generic** starter content at `content/site.json` and `content/pages/{home,about,contact}.json` — those files demonstrate the block system using placeholder copy ("A small site, made well", "What this is", etc.). Your job: replace that generic content with content specific to *this* client. Don't just tweak it — write fresh content from scratch using the client's voice and what you know about their business.

**`content/site.json`:**
- Set `siteName` to the provided site name
- Set `theme.preset` to the chosen theme preset (one of `editorial` / `studio` / `tech` / `warm` / `monochrome`)
- Set `theme.appearance` to `light` (default) or `dark` if the client wants dark mode
- Set `fonts.pair` to match the theme preset (same name — `"editorial"` pair for `editorial` theme, etc.)
- Update `nav` to match the pages you'll create — keep it short (3–5 items max)
- The `colors` block is a legacy fallback for sites that don't use a theme preset; you can leave it at defaults

**`content/pages/home.json`:**
- Replace the generic blocks with a real home page for this client. Read `AI_PLAYBOOK.md` for the block catalog.
- Most home pages: one `hero` (always top), one `grid` (3 cards of value props or features), one `quote` (if you have a testimonial or memorable line), one `section` as a CTA at the bottom.
- Don't add 10 blocks. 4–6 is usually right.

**`content/pages/about.json`:**
- Replace with a real about-page composition. Typically: `heading` (page title) → `text` (the story, 1-3 paragraphs split on blank lines) → `two-column` (mission/values, or who we are/who we serve) → optional `quote`.

**`content/pages/contact.json`:**
- Keep the structure (heading + text + form) but customize:
  - Heading: "Get in touch" or whatever fits the brand voice
  - Form fields: keep name/email/message as the minimum; add others if the client needs them
  - Set the form action to the provided contact email (e.g., `mailto:hello@example.com`) if no other action is set up

**Additional pages:** Add `content/pages/{slug}.json` for whatever the client needs — services, pricing, work, blog, FAQ. Stick to the 10 base blocks unless the client has a need none of them cover.

**`package.json`:**
- Set `name` to the client name (kebab-case)
- Set `description` to the provided description
- Keep everything else unchanged

**Theme preview:** mention to the developer that `npm run dev` then visiting `http://localhost:3000/ui-preview` lets them see how the chosen theme looks across all primitives. If the dev wants to try a different theme, they can change `theme.preset` in `site.json` and refresh.

### Step 3: Create deploy.json

Write this file with the provided values. Leave server fields blank — they get filled by `/deploy-init` later.

```json
{
  "site": {
    "name": "{clientName}-site",
    "domain": "{domain or empty string}",
    "repo": "{gh-username}/{clientName}-site"
  },
  "server": {
    "host": "",
    "user": "",
    "sshKeyPath": "~/.ssh/id_ed25519",
    "port": 22
  },
  "docker": {
    "containerName": "{clientName}-site",
    "port": 3001
  },
  "status": "not-deployed"
}
```

Use the actual authenticated GitHub username from `gh auth status` for the `repo` field.

**SECURITY:** This file contains ZERO secrets. `sshKeyPath` is a file path reference, not the key.

### Step 4: Write Client README

Replace `README.md` with a simple client-specific version:

```markdown
# {siteName}

{description}

## Local Development

\`\`\`bash
npm run dev
\`\`\`

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (password-protected in production)
- UI preview / theme switcher: http://localhost:3000/ui-preview

## Editing Content

Most edits happen in the admin panel at `/admin`. Behind the scenes:

- Pages: `content/pages/*.json`
- Site config (nav, theme, site name): `content/site.json`
- Uploads: `public/uploads/`

## Custom Blocks

If the 10 base blocks don't cover what you need, add a custom block in `client/blocks/`. See `client/README.md` for the walkthrough — short version: render component + admin editor + manifest + register in 3 files.

## Deployment

Run `/deploy-init` in Claude for first-time server setup, then `/deploy` for updates.

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for system diagrams and `CLAUDE.md` for the rules.
```

### Step 5: Install Dependencies

```bash
npm install
```

If this fails, try:
```bash
rm -rf node_modules package-lock.json && npm install
```

### Step 6: Verify Build

```bash
npm run build
```

The build MUST pass before committing. If it fails:
1. Read the error output carefully
2. Attempt to fix the issue
3. Rebuild (max 2 retries)
4. If still failing, tell the developer — this may be a framework bug

### Step 7: Commit Scaffold and Create Client Repo

Do NOT run `git init` — the repo is already initialized with framework history (from Step 1). Just stage and commit the scaffold changes on top:

```bash
git add -A
git add -f .client-site
git commit -m "feat: initial site scaffold for {siteName}"
```

Then create the private GitHub repo and add it as `origin`:

```bash
gh repo create {clientName}-site --private --source=. --remote=origin --push
```

After this, you should have TWO remotes:
- `origin` → the client's private repo (push site-specific commits here)
- `framework` → https://github.com/Hude06/website-framework (read-only, pull updates with `npm run sync-framework`)

Verify with `git remote -v`.

If the repo name is already taken:
- Tell the developer: "The repo name {clientName}-site already exists."
- Ask for an alternative name
- Retry with the new name

### Step 8: Print Summary

After everything succeeds, print:

```
Site scaffolded successfully!

  Repo:     https://github.com/{username}/{clientName}-site
  Theme:    {chosen theme preset}
  Local:    npm run dev → http://localhost:3000
  Admin:    http://localhost:3000/admin
  Preview:  http://localhost:3000/ui-preview  (theme switcher)

Next steps:
  1. Run `npm run dev` to start developing
  2. Open /ui-preview to verify the theme looks right; change `theme.preset` in content/site.json if you want to try another
  3. Continue customizing pages with Claude — content/pages/*.json
  4. Run `/deploy-init` when ready to deploy to production
```

## Error Recovery

- **Clone fails:** Check internet, check repo exists (`gh repo view Hude06/website-framework`)
- **npm install fails:** Delete `node_modules` and `package-lock.json`, retry
- **Build fails:** Read error, attempt fix, retry up to 2 times
- **gh repo create fails (name taken):** Ask developer for alternative repo name
- **gh repo create fails (auth):** Run `gh auth status`, suggest `! gh auth login`
- **Any catastrophic failure:** Leave directory as-is so developer can inspect. Do not clean up.

## What NOT to Do

- Do not run `npm run dev` — just tell the developer to run it
- Do not open a browser
- Do not SSH to any server
- Do not create `.env` files (no secrets needed at this stage)
- Do not modify framework docs (`CLAUDE.md`, `AGENTS.md`, `AI_PLAYBOOK.md`, `DESIGN_TOOLKITS.md`, `ARCHITECTURE.md`)
- **Do not add Tailwind, shadcn, base-ui, class-variance-authority, clsx, tailwind-merge, DaisyUI, Mantine, or any other CSS framework / component library.** The framework was deliberately built without one. UI tailoring happens through theme presets + the 12 primitives in `lib/ui/` + per-client custom blocks. See `DESIGN_TOOLKITS.md` for the forbidden-additions list and acceptable scoped libs.
- Do not add extra runtime dependencies beyond what the framework includes unless the client genuinely needs them (and if so, add as a per-client custom block, not at the framework level).
- Do not hand-roll JSX inside `app/(site)/` routes — extend the block system instead. If a block type doesn't exist, build a custom one in `client/blocks/`.
- **Do not `rm -rf .git`** — framework update merges need the shared history
- **Do not edit framework-zone files during scaffolding** (anything outside `client/`, `content/pages/`, `content/site.json`, `public/uploads/`, `package.json`, `README.md`, `deploy.json`). If the zone guard blocks something, you're in the wrong zone.
- Do not edit the frozen `client/` stubs (`registry.ts`, `editor-registry.ts`, `gallery.ts`, `types.ts`, `theme.ts`) during scaffolding — leave them as empty stubs. Clients fill them in when they actually add a custom block.
