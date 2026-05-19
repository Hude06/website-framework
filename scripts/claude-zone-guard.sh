#!/usr/bin/env bash
# claude-zone-guard.sh — Claude Code PreToolUse hook that blocks Edit/Write/MultiEdit
# calls targeting framework-zone files in a client site (or client-zone files in the framework).
#
# Reads the tool call as JSON from stdin:
#   {"tool_name": "Edit", "tool_input": {"file_path": "/abs/path", ...}}
# Exit code 2 with stderr output tells Claude the call was rejected.
# Exit code 0 allows it through.
#
# FRAMEWORK_EDIT=1 disables the guard.

set -euo pipefail

if [[ "${FRAMEWORK_EDIT:-0}" == "1" ]]; then
  exit 0
fi

INPUT="$(cat)"
FILE_PATH="$(printf '%s' "$INPUT" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Only act on paths inside this repo
case "$FILE_PATH" in
  "$REPO_ROOT"/*) ;;
  *) exit 0 ;;
esac

REL="${FILE_PATH#$REPO_ROOT/}"

IS_CLIENT_SITE=0
if [[ -f "$REPO_ROOT/.client-site" ]]; then
  IS_CLIENT_SITE=1
fi

is_framework_zone() {
  local f="$1"
  case "$f" in
    client/*)        return 1 ;;
    content/pages/*) return 1 ;;
    content/site.json) return 1 ;;
    public/uploads/*) return 1 ;;
    .client-site)    return 1 ;;
    app/*|components/*|lib/*) return 0 ;;
    middleware.ts|next.config.ts|Dockerfile|nginx.conf) return 0 ;;
    content/themes/*|content/placeholders.json) return 0 ;;
    AI_PLAYBOOK.md|ARCHITECTURE.md|DESIGN_TOOLKITS.md|AGENTS.md) return 0 ;;
    scripts/*|.husky/*|.claude/*) return 0 ;;
    eslint.config.mjs|jest.config.ts|tsconfig.json) return 0 ;;
    *) return 1 ;;
  esac
}

is_client_zone() {
  local f="$1"
  case "$f" in
    client/blocks/.gitkeep|client/themes/.gitkeep|client/README.md) return 1 ;;
    client/*) return 0 ;;
    content/pages/*) return 0 ;;
    content/site.json) return 0 ;;
    public/uploads/*) return 0 ;;
    .client-site) return 0 ;;
    *) return 1 ;;
  esac
}

if [[ $IS_CLIENT_SITE -eq 1 ]]; then
  if is_framework_zone "$REL"; then
    echo "✗ Zone guard: '$REL' is framework-owned and cannot be edited in a client site." >&2
    echo "  Client customizations belong in client/, content/pages/, content/site.json, or public/uploads/." >&2
    echo "  To override: set FRAMEWORK_EDIT=1 in the environment (be prepared to resolve merge conflicts on sync-framework)." >&2
    exit 2
  fi
else
  if is_client_zone "$REL"; then
    echo "✗ Zone guard: '$REL' is client-owned and must not be edited in the framework repo." >&2
    echo "  Editing this file will cause merge conflicts in every client site on next framework update." >&2
    echo "  To override: set FRAMEWORK_EDIT=1 in the environment." >&2
    exit 2
  fi
fi

exit 0
