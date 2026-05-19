#!/usr/bin/env bash
# check-zones.sh — enforces framework/client zone boundaries.
#
# Usage:
#   scripts/check-zones.sh              (runs in git pre-commit context — checks staged files)
#   scripts/check-zones.sh path1 path2  (explicit mode — checks the given paths)
#
# Behavior:
#   - If the repo is a CLIENT SITE (detected by presence of .client-site at repo root),
#     blocks edits to framework-zone paths.
#   - If the repo is the FRAMEWORK ITSELF (no .client-site marker), blocks edits to
#     client-zone paths (except initial stubs).
#   - FRAMEWORK_EDIT=1 in the environment disables all checks.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

if [[ "${FRAMEWORK_EDIT:-0}" == "1" ]]; then
  exit 0
fi

FILES=()
if [[ $# -gt 0 ]]; then
  FILES=("$@")
else
  while IFS= read -r line; do
    [[ -n "$line" ]] && FILES+=("$line")
  done < <(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || true)
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  exit 0
fi

IS_CLIENT_SITE=0
if [[ -f "$REPO_ROOT/.client-site" ]]; then
  IS_CLIENT_SITE=1
fi

# Framework-zone paths (blocked in CLIENT sites)
is_framework_zone() {
  local f="$1"
  case "$f" in
    client/*)        return 1 ;;  # client zone wins
    content/pages/*) return 1 ;;  # client data
    content/site.json) return 1 ;;  # client data
    public/uploads/*) return 1 ;;  # client uploads
    .client-site)    return 1 ;;  # client marker
    app/*|components/*|lib/*) return 0 ;;
    middleware.ts|next.config.ts|Dockerfile|nginx.conf) return 0 ;;
    content/themes/*|content/placeholders.json) return 0 ;;
    AI_PLAYBOOK.md|ARCHITECTURE.md|DESIGN_TOOLKITS.md|AGENTS.md) return 0 ;;
    scripts/*|.husky/*|.claude/*) return 0 ;;
    eslint.config.mjs|jest.config.ts|tsconfig.json) return 0 ;;
    *) return 1 ;;  # everything else (package.json, README.md, CLAUDE.md, .gitignore, deploy.json) is shared/client-editable
  esac
}

# Client-zone paths (blocked in the FRAMEWORK repo, unless they are the initial stubs)
# Stubs listed here are considered framework-owned after Phase 1 and should NOT be touched
# by the framework either — editing them WILL cause merge conflicts for every client.
is_client_zone() {
  local f="$1"
  case "$f" in
    client/blocks/.gitkeep|client/themes/.gitkeep|client/README.md) return 1 ;;  # frozen stubs, allowed to edit in framework
    client/*) return 0 ;;
    content/pages/*) return 0 ;;
    content/site.json) return 0 ;;
    public/uploads/*) return 0 ;;
    .client-site) return 0 ;;
    *) return 1 ;;
  esac
}

VIOLATIONS=()

for f in "${FILES[@]}"; do
  [[ -z "$f" ]] && continue
  if [[ $IS_CLIENT_SITE -eq 1 ]]; then
    if is_framework_zone "$f"; then
      VIOLATIONS+=("$f")
    fi
  else
    if is_client_zone "$f"; then
      VIOLATIONS+=("$f")
    fi
  fi
done

if [[ ${#VIOLATIONS[@]} -eq 0 ]]; then
  exit 0
fi

echo ""
if [[ $IS_CLIENT_SITE -eq 1 ]]; then
  echo "✗ check-zones: refusing to commit framework-zone files in a client site."
  echo ""
  echo "  The following files are framework-owned and should not be edited in a client repo:"
  for f in "${VIOLATIONS[@]}"; do
    echo "    - $f"
  done
  echo ""
  echo "  Client customizations belong in client/, content/pages/, content/site.json, or public/uploads/."
  echo "  If you really need to patch the framework from a client site, set FRAMEWORK_EDIT=1 and accept"
  echo "  that your changes may conflict on the next 'scripts/sync-framework.sh'."
else
  echo "✗ check-zones: refusing to commit client-zone files in the framework repo."
  echo ""
  echo "  The following files are client-owned and must not ship upstream:"
  for f in "${VIOLATIONS[@]}"; do
    echo "    - $f"
  done
  echo ""
  echo "  These files live in individual client site repos, not in the framework."
  echo "  If you are editing framework stubs intentionally, set FRAMEWORK_EDIT=1 — but know that"
  echo "  editing client/registry.ts, client/theme.ts, etc. after their initial commit will cause"
  echo "  merge conflicts for every existing client site."
fi
echo ""
exit 1
