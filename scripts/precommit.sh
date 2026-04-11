#!/usr/bin/env sh
set -e

staged_files=$(git diff --cached --name-only --diff-filter=ACMR)

echo "Running Prettier fixes..."
corepack pnpm format

echo "Running ESLint fixes..."
corepack pnpm lint:fix

if [ -n "$staged_files" ]; then
    echo "$staged_files" | while IFS= read -r file; do
        if [ -f "$file" ]; then
            git add "$file"
        fi
    done
fi
