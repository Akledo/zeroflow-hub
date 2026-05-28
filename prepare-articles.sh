#!/bin/bash
# Add Eleventy front matter to shared articles and copy to repo
TARGET="/home/agent-engineer/zeroflow-hub/src/content"
ARTICLES="/home/team/shared/articles"

for f in "$ARTICLES"/*.md; do
  fn=$(basename "$f")
  slug="${fn%.md}"
  
  # Extract title from first line
  title=$(head -1 "$f" | sed 's/^# //' | sed 's/"/\\"/g')
  
  # Extract description from first non-heading, non-bracket line
  desc=$(grep -v '^#' "$f" | grep -v '^\[' | grep -v '^$' | head -1 | sed 's/"/\\"/g' | cut -c1-150)
  
  # Infer category
  lc=$(echo "$slug" | tr '[:upper:]' '[:lower:]')
  category="Reviews"
  case "$lc" in
    *gardyn*|*hydroponic*) category="Smart Home" ;;
    *scanner*|*3d*|*revopoint*) category="Technology" ;;
    *ai*|*elevenlabs*|*murf*|*descript*|*tiktok*|*multimedia*) category="AI Tools" ;;
  esac
  
  # Write front matter + body
  echo "---" > "$TARGET/$fn"
  echo "layout: layouts/article.njk" >> "$TARGET/$fn"
  echo "schemaType: Article" >> "$TARGET/$fn"
  echo "title: \"$title\"" >> "$TARGET/$fn"
  echo "description: \"$desc\"" >> "$TARGET/$fn"
  echo "date: 2026-05-28" >> "$TARGET/$fn"
  echo "category: \"$category\"" >> "$TARGET/$fn"
  echo "author: \"ZeroFlow Team\"" >> "$TARGET/$fn"
  echo "---" >> "$TARGET/$fn"
  echo "" >> "$TARGET/$fn"
  # Append body (skip first line title, skip affiliate disclosure)
  tail -n +2 "$f" | grep -v '^\[Affiliate' >> "$TARGET/$fn"
  
  echo "OK: $fn ($category)"
done
echo ""
echo "Total: $(ls "$TARGET"/*.md | wc -l) articles"