# Website Framework — Architecture

## System Overview

```mermaid
graph TB
    subgraph LOCAL["Developer Machine"]
        DEV[Developer + Claude]
        LOCAL_REPO[Local Git Repo]
        DEV -->|works on code| LOCAL_REPO
    end

    subgraph GH["GitHub (Private Repo)"]
        REMOTE_REPO[Remote Repository]
    end

    subgraph LINODE["Linode Ubuntu Server"]
        NGINX[Nginx Reverse Proxy + SSL + /admin Auth]
        subgraph DOCKER["Docker Container"]
            REPO[Git Repo Clone]
            NEXTJS["Next.js Server (site + admin)"]
            CONTENT[/content/ files]
            UPLOADS[/public/uploads/]
        end
    end

    subgraph CLIENT["Client Browser"]
        SITE_VIEW[Views Website]
        ADMIN_VIEW[Admin Panel at /admin]
    end

    LOCAL_REPO -->|git push| REMOTE_REPO
    REMOTE_REPO -->|git pull| REPO
    NEXTJS -->|serves pre-rendered pages| SITE_VIEW
    NEXTJS -->|serves admin panel + API| ADMIN_VIEW
    NGINX -->|reverse proxy all traffic| DOCKER
    NGINX -->|basic auth on /admin| ADMIN_VIEW
    CLIENT -->|clientsite.com| NGINX
    CLIENT -->|clientsite.com/admin| NGINX
    CONTENT -->|auto commit + push| REMOTE_REPO
```

### Key Architecture Decision: Server Mode

Next.js runs as a **server** in Docker, not as a static export. This is required because:
- The admin panel needs API routes to write content files and trigger rebuilds
- Pages are still **pre-rendered at build time** (ISR/SSG) — same performance as static
- One process serves both the site and the admin panel
- No separate API server needed

---

## Project Setup Flow (`/website-init`)

```mermaid
flowchart TD
    A[Developer runs /website-init] --> B[Claude pulls framework from GitHub]
    B --> C[Claude creates new private GitHub repo]
    C --> D[Scaffold site from starter template]
    D --> E[Install dependencies]
    E --> F[Initialize git + push to GitHub]
    F --> G[Ready for local development]
    G --> H[npm run dev — hot reload on localhost:3000]
```

---

## First Deploy Flow (`/deploy-init`)

```mermaid
flowchart TD
    A[Developer runs /deploy-init] --> B{Is domain pointed to server IP?}
    B -->|No| B1[Claude shows DNS instructions, waits]
    B -->|Yes| C{Can Claude SSH into server?}
    C -->|No| C1[Setup SSH access]
    C -->|Yes| D{Is Docker installed?}
    D -->|No| D1[Install Docker]
    D -->|Yes| E{Nginx config exists for domain?}
    E -->|No| E1[Generate Nginx config + enable site]
    E -->|Yes| F{SSL cert exists?}
    F -->|No| F1[Run Certbot for HTTPS]
    F -->|Yes| G[Setup admin auth]

    B1 --> B
    C1 --> D
    D1 --> E
    E1 --> F
    F1 --> G

    G --> G1[Ask developer for admin password]
    G1 --> G2[Create .htpasswd file on server]
    G2 --> G3[Add basic auth for /admin path in Nginx]
    G3 --> H[Build Docker image from Dockerfile]
    H --> I[Start container with deploy key]
    I --> J[Clone repo inside container]
    J --> K[Run npm install + npm run build]
    K --> L[Start Next.js server inside container]
    L --> M[Verify site is live — health check]
    M --> N[Write deploy.json to repo]
    N --> O[Commit + push deploy.json]
    O --> P[First deploy complete]
```

---

## Developer Deploy Flow (`/deploy`)

```mermaid
flowchart TD
    A[Developer runs /deploy] --> B{Uncommitted changes?}
    B -->|Yes| B1[Commit + push to GitHub]
    B -->|No| C{Local repo up to date with remote?}
    C -->|No| C1[Git pull — merge client changes]
    C1 --> C2{Merge conflicts?}
    C2 -->|Yes| C3[Claude surfaces conflicts, developer resolves]
    C2 -->|No| D[Push to GitHub]
    C -->|Yes| D

    B1 --> C
    C3 --> D

    D --> E[SSH into Linode server]
    E --> F[Git pull inside container]
    F --> G[npm run build inside container]
    G --> H[Restart Next.js server]
    H --> I[Health check — verify site responds]
    I -->|Fail| J[Git checkout previous commit inside container]
    J --> J2[npm run build — restore last working version]
    J2 --> J3[Restart Next.js server with previous build]
    J3 --> J4[Site stays live on previous version]
    J4 --> J5[Alert developer with error logs]
    I -->|Pass| K[Deploy complete]
```

---

## Client Edit Flow (Admin Panel)

```mermaid
flowchart TD
    A[Client visits clientsite.com/admin] --> B[Nginx basic auth prompt]
    B --> C[Client enters password]
    C --> D[Admin page editor loads]
    D --> E{What does client want to do?}
    E --> F[Edit existing page]
    E --> G[Add new page]
    E --> H[Delete page]

    F --> F1[Select page from sidebar]
    F1 --> F2[Edit text fields, reorder blocks]
    F2 --> F3[See changes in live preview iframe]
    F3 --> F4[Click Save]

    G --> G1[Enter page title and slug]
    G1 --> G2[New page created with empty blocks]
    G2 --> F1

    H --> H1[Select page, click Delete]
    H1 --> H2[Confirm deletion]

    F4 --> I[Admin API writes updated JSON to /content/pages/]
    H2 --> I
    I --> J[Trigger npm run build]
    J --> K[Pages re-rendered with new content]
    K --> L[Preview iframe refreshes — client sees changes]
    L --> M[Auto git commit with descriptive message]
    M --> N[Git push to GitHub via deploy key]
    N --> O[Change tracked in repo history]
```

---

## Admin Panel — Page Editor Architecture

```mermaid
graph TB
    subgraph ADMIN_UI["Admin Panel at /admin"]
        SIDEBAR[Page List Sidebar]
        EDITOR[Block Editor — form fields]
        PREVIEW[Live Preview — iframe of real page]
        PAGE_MGMT[Add / Delete Page]
    end

    subgraph API["Admin API Routes (/api/admin/)"]
        LIST_PAGES["GET /api/admin/pages"]
        GET_PAGE["GET /api/admin/pages/[slug]"]
        SAVE_PAGE["PUT /api/admin/pages/[slug]"]
        CREATE_PAGE["POST /api/admin/pages"]
        DELETE_PAGE["DELETE /api/admin/pages/[slug]"]
        UPLOAD_IMG["POST /api/admin/upload"]
        REBUILD["POST /api/admin/rebuild"]
    end

    subgraph CONTENT["/content/"]
        PAGES["pages/*.json"]
        UPLOADS["uploads/*"]
        SITE_CONFIG["site.json"]
    end

    SIDEBAR -->|fetches| LIST_PAGES
    EDITOR -->|fetches| GET_PAGE
    EDITOR -->|saves| SAVE_PAGE
    PAGE_MGMT -->|creates| CREATE_PAGE
    PAGE_MGMT -->|deletes| DELETE_PAGE
    SAVE_PAGE -->|writes JSON| PAGES
    SAVE_PAGE -->|triggers| REBUILD
    CREATE_PAGE -->|writes JSON| PAGES
    DELETE_PAGE -->|removes JSON| PAGES
    UPLOAD_IMG -->|saves file| UPLOADS
    REBUILD -->|npm run build + git commit + push| CONTENT
    PREVIEW -->|iframe src=/page-slug| PAGES
```

### Admin Panel UI Layout

```
┌─────────────────────────────────────────────────────┐
│  Site Name                              /admin      │
├────────────┬────────────────────────────────────────┤
│            │                                        │
│  Pages     │  Editing: About                        │
│            │                                        │
│  • Home    │  ┌─ Heading ─────────────────────┐     │
│  > About   │  │ About Me                      │     │
│  • Contact │  └───────────────────────────────┘     │
│            │  ┌─ Paragraph ───────────────────┐     │
│            │  │ I've been building websites... │     │
│  ──────    │  └───────────────────────────────┘     │
│  + Add     │  ┌─ Image ──────────────────────┐     │
│  Page      │  │ portrait.svg  [Change]        │     │
│            │  └───────────────────────────────┘     │
│            │                                        │
│            │  [Save]              [Preview ▸]       │
├────────────┴────────────────────────────────────────┤
│  Preview (iframe — shows real rendered page)        │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  │        Actual site rendering of /about         │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### The Contract

The admin panel and the template are decoupled. They only share `/content/` files.

- **Admin panel** reads and writes content files via API routes — doesn't know or care about CSS frameworks or styling
- **Template** reads content files and renders them — any framework, any styles
- **Preview** is an iframe of the actual site — always accurate regardless of template

### Content File Format

```json
{
  "title": "About",
  "slug": "about",
  "blocks": [
    { "id": "b1", "type": "heading", "text": "About Me", "level": 1, "size": "display" },
    { "id": "b2", "type": "text", "body": "I design things…\n\nAnd I do it well." },
    { "id": "b3", "type": "image", "src": "/uploads/portrait.jpg", "alt": "Portrait" },
    { "id": "b4", "type": "grid", "heading": "Projects", "columns": 3, "items": [
      { "title": "Project A", "body": "Description" },
      { "title": "Project B", "body": "Description" }
    ]},
    { "id": "b5", "type": "button", "label": "Contact me", "href": "/contact", "variant": "primary" }
  ]
}
```

### Template Contract (only requirement)

Every template must implement a `BlockRenderer` that handles content block types:

```
BlockRenderer reads block.type → renders with template-specific styling
```

This means the admin panel works with any CSS framework (Tailwind, Bootstrap, vanilla CSS, etc.) because it never touches the rendering — it only edits the data.

---

## Admin Authentication — Nginx Basic Auth

```mermaid
flowchart LR
    CLIENT[Client Browser] -->|clientsite.com/admin| NGINX[Nginx]
    NGINX -->|auth_basic on /admin path| HTPASSWD[.htpasswd-clientsite]
    HTPASSWD -->|password valid| CONTAINER["Next.js Server — /admin routes"]
    HTPASSWD -->|password invalid| DENIED[401 Unauthorized]
```

### Nginx Config

```nginx
server {
    server_name clientsite.com;

    # All traffic proxied to Next.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Admin path requires basic auth
    location /admin {
        auth_basic "Admin";
        auth_basic_user_file /etc/nginx/.htpasswd-clientsite;
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Admin API also requires auth
    location /api/admin {
        auth_basic "Admin";
        auth_basic_user_file /etc/nginx/.htpasswd-clientsite;
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # SSL managed by Certbot
}
```

### Why Nginx Basic Auth

- Zero auth code in the framework
- Zero auth bugs — battle-tested
- Password change is one command on the server
- HTTPS via Certbot encrypts credentials in transit
- One less thing to build per site
- Works with any template

---

## Image Uploads

- Images uploaded through the admin panel are saved to `/public/uploads/`
- Referenced in content JSON as `/uploads/filename.jpg` (Next.js serves files in `/public/` at the root URL)
- Committed to git alongside content changes
- Suitable for small sites (< 10 images)
- For image-heavy sites, can be migrated to object storage per-site later

---

## Developer Starts Working (Daily Flow)

```mermaid
flowchart TD
    A[Developer opens project in Claude] --> B[Auto git pull — includes any client changes]
    B --> D[Start working]
    D --> E[npm run dev — localhost:3000]
    E --> F[Develop with Claude]
    F --> G[Commit often to GitHub]
    G --> H{Ready to deploy?}
    H -->|No| F
    H -->|Yes| I[Run /deploy]
```

---

## Docker Image Rebuild (Rare)

```mermaid
flowchart TD
    A[Need to change environment] --> B{What changed?}
    B --> C[Node.js version upgrade]
    B --> D[New system dependency]
    B --> E[Dockerfile changes]
    B --> F[Major framework upgrade]
    C --> G[Run /deploy-init again]
    D --> G
    E --> G
    F --> G
    G --> H[Rebuild Docker image]
    H --> I[Replace container on server]
    I --> J[Pull latest code + content from GitHub]
    J --> K[npm run build + start server]
    K --> L[Verify health check]
```

---

## Starter Template — 3 Page Portfolio

```
/content/pages/
  home.json       ← hero, intro, featured work cards, tech badges
  about.json      ← bio, portrait, skills badges
  contact.json    ← contact cards, availability badges

/content/site.json ← site name, nav links, fonts, colors
```

---

## File Structure (Inside Each Site Repo)

```
site-repo/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — Header, Footer, site config
│   ├── page.tsx                # Home route — loads home.json
│   ├── not-found.tsx           # 404 page
│   ├── [slug]/
│   │   └── page.tsx            # Dynamic route — loads /content/pages/{slug}.json
│   ├── admin/
│   │   ├── page.tsx            # Admin panel — page editor UI
│   │   └── layout.tsx          # Admin layout (no site header/footer)
│   └── api/
│       └── admin/
│           ├── pages/
│           │   └── route.ts    # GET (list) / POST (create) pages
│           │   └── [slug]/
│           │       └── route.ts # GET / PUT / DELETE a page
│           ├── upload/
│           │   └── route.ts    # POST image upload
│           └── rebuild/
│               └── route.ts    # POST trigger rebuild + git commit/push
├── components/
│   ├── Header.tsx              # CSS Modules, no Tailwind
│   ├── Footer.tsx
│   ├── BlockRenderer.tsx       # Registry: merges framework + client blocks
│   ├── admin/
│   │   ├── BlockEditor.tsx     # Dispatcher: block.type → editor component
│   │   ├── BlockGallery.tsx    # "Add block" modal (manifests + client templates)
│   │   ├── PageSidebar.tsx
│   │   ├── PreviewPanel.tsx
│   │   ├── NavEditor.tsx
│   │   ├── SiteSettingsEditor.tsx
│   │   ├── manifests.ts        # Block templates with defaults
│   │   └── editors/            # One editor per block type
│   └── blocks/                 # The 10 base block render components
│       ├── HeadingBlock.tsx
│       ├── TextBlock.tsx
│       ├── ImageBlock.tsx
│       ├── ButtonBlock.tsx
│       ├── HeroBlock.tsx
│       ├── SectionBlock.tsx
│       ├── GridBlock.tsx
│       ├── TwoColumnBlock.tsx
│       ├── QuoteBlock.tsx
│       └── FormBlock.tsx
├── lib/
│   ├── ui/                     # 12 hand-rolled UI primitives + CSS Modules
│   │   ├── Container.tsx       # Display: Container, Stack, Heading, Text, Button
│   │   ├── TextField.tsx       # Form: TextField, TextAreaField, NumberField,
│   │   ├── ArrayField.tsx      #       SelectField, ToggleField, ImageField, ArrayField
│   │   └── ...
│   ├── content.ts              # loadPage(), loadSiteConfig(), listPages()
│   ├── types.ts                # Block, PageContent, SiteConfig types
│   ├── schemas.ts              # Zod schemas — validate admin saves
│   ├── themes.ts               # Theme preset loader
│   ├── motion.tsx              # Reveal / Stagger / Parallax (Framer Motion)
│   └── utils.ts                # cn() class joiner (no Tailwind merge)
├── content/
│   ├── pages/                  # JSON: home, about, contact
│   ├── themes/                 # 5 theme preset JSON files
│   ├── uploads/                # Client-uploaded images (< 10, committed to git)
│   └── site.json               # Site name, nav, fonts, theme preset
├── public/
│   └── images/                 # Static template assets
├── deploy.json                 # Deployment config (created by /deploy-init)
├── Dockerfile
├── next.config.ts
├── tsconfig.json
├── jest.config.ts
├── eslint.config.mjs
├── package.json                # 6 runtime deps: next, react, react-dom, lucide-react, motion, zod
└── README.md
```

---

## Security Model

```mermaid
flowchart LR
    subgraph SERVER["Linode Server"]
        NGINX[Nginx]
        HTPASSWD[.htpasswd per site]
        subgraph CONTAINER["Docker Container"]
            NEXTJS["Next.js Server"]
            KEY[GitHub Deploy Key]
        end
    end

    NGINX -->|HTTPS only via Certbot| INTERNET[Internet]
    NGINX -->|basic auth on /admin + /api/admin| HTPASSWD
    HTPASSWD -->|authenticated requests only| NEXTJS
    NEXTJS -->|serves site pages without auth| INTERNET
    KEY -->|push only, no delete, no force push| GH[GitHub Repo]
    KEY -->|scoped to single repo| GH
```
