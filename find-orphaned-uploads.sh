#!/bin/bash
# Run from repo root. Lists files in backend/uploads not referenced by any ChapterPage.config.
cd backend

for f in uploads/*; do
  name=$(basename "$f")
  [ "$name" = ".gitkeep" ] && continue
  hit=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM ChapterPage WHERE config LIKE '%${name}%';")
  if [ "$hit" -eq 0 ]; then
    echo "ORPHAN: $f"
  fi
done
