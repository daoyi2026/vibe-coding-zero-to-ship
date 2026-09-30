#!/usr/bin/env bash
set -euo pipefail

SKILL_NAME="vibe-coding-zero-to-ship"
REPO_ARCHIVE="https://github.com/daoyi2026/vibe-coding-zero-to-ship/archive/refs/heads/main.tar.gz"
TARGET_KIND="codex"
UPDATE=0

usage() {
  cat <<'EOF'
Usage:
  bash scripts/install.sh [--target codex|cursor|agents] [--update]

Defaults:
  --target codex

Targets:
  codex   ~/.codex/skills/vibe-coding-zero-to-ship
  cursor  ~/.cursor/skills/vibe-coding-zero-to-ship
  agents  ~/.agents/skills/vibe-coding-zero-to-ship

Safety:
  - Never overwrites an existing installation unless --update is given.
  - --update makes a timestamped backup first.
  - Installs only runtime skill files, not tests or CI files.
EOF
}

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --target)
      if [[ "$#" -lt 2 ]]; then echo "Missing value after --target" >&2; exit 2; fi
      TARGET_KIND="$2"
      shift 2
      ;;
    --update)
      UPDATE=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

case "$TARGET_KIND" in
  codex)
    ROOT="$HOME/.codex/skills"
    ;;
  cursor)
    ROOT="$HOME/.cursor/skills"
    ;;
  agents)
    ROOT="$HOME/.agents/skills"
    ;;
  *)
    echo "Unsupported target: $TARGET_KIND" >&2
    usage >&2
    exit 2
    ;;
esac

TARGET="$ROOT/$SKILL_NAME"

for cmd in curl tar mktemp cp mkdir date find head mv rm; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "Missing required command: $cmd" >&2
    exit 1
  }
done

if [[ -e "$TARGET" && "$UPDATE" -ne 1 ]]; then
  cat >&2 <<EOF
An installation already exists at:
  $TARGET

Nothing was changed.

To update safely and keep a backup:
  bash scripts/install.sh --target $TARGET_KIND --update
EOF
  exit 3
fi

TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

ARCHIVE="$TMP/skill.tar.gz"
echo "Downloading skill source from GitHub..."
curl --fail --location --silent --show-error "$REPO_ARCHIVE" --output "$ARCHIVE"

echo "Extracting..."
tar -xzf "$ARCHIVE" -C "$TMP"

SOURCE="$(find "$TMP" -maxdepth 1 -type d -name "vibe-coding-zero-to-ship-*" | head -n 1)"
if [[ -z "$SOURCE" || ! -f "$SOURCE/SKILL.md" ]]; then
  echo "Downloaded archive does not contain the expected SKILL.md." >&2
  exit 1
fi

mkdir -p "$ROOT"

if [[ -e "$TARGET" ]]; then
  BACKUP="$TARGET.backup-$(date +%Y%m%d-%H%M%S)"
  echo "Backing up existing installation to:"
  echo "  $BACKUP"
  mv "$TARGET" "$BACKUP"
fi

mkdir -p "$TARGET"
for item in SKILL.md references workflows checklists templates; do
  if [[ -e "$SOURCE/$item" ]]; then
    cp -R "$SOURCE/$item" "$TARGET/"
  fi
done

if [[ ! -f "$TARGET/SKILL.md" ]]; then
  echo "Installation verification failed: SKILL.md is missing." >&2
  exit 1
fi

echo
echo "Installed successfully:"
echo "  $TARGET"
echo
echo "No active project files were modified."
echo "Restart or reopen your coding agent if it does not discover the skill immediately."
