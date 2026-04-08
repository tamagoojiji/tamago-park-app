#!/bin/bash
# ビルド前チェック: API base URLのフォールバックが空文字でないことを確認
set -e

ERRORS=0
SRC_DIR="$(dirname "$0")/../src"

# VITE_API_BASE_URL または VITE_AUTH_API_URL のフォールバックが空文字のファイルを検出
while IFS= read -r line; do
  file=$(echo "$line" | cut -d: -f1)
  content=$(echo "$line" | cut -d: -f2-)
  # フォールバックが '' または "" のケースを検出
  if echo "$content" | grep -qE "\|\|\s*['\"]'?\s*['\"]"; then
    echo "ERROR: API base URL fallback is empty in $file"
    echo "  $content"
    ERRORS=$((ERRORS + 1))
  fi
done < <(grep -rn "VITE_.*API.*URL\|VITE_.*BASE_URL" "$SRC_DIR" --include="*.ts" --include="*.tsx")

if [ $ERRORS -gt 0 ]; then
  echo ""
  echo "FAILED: $ERRORS file(s) have empty API URL fallbacks."
  echo "All API URLs must have a valid fallback (e.g., 'https://api.tamago-ai-world.com')"
  exit 1
fi

echo "OK: All API base URLs have valid fallbacks."
