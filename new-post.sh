#!/bin/bash

# Blog post generator script
# Usage: ./new-post.sh "Your Post Title"

if [ -z "$1" ]; then
  echo "Usage: ./new-post.sh \"Your Post Title\""
  echo "Example: ./new-post.sh \"Learning React Hooks\""
  exit 1
fi

TITLE="$1"
DATE=$(date +%Y-%m-%d)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g')
FILENAME="${DATE}-${SLUG}.html"
FILEPATH="posts/${FILENAME}"

# Create the post file from template
cp post-template.html "$FILEPATH"

# Replace placeholders
sed -i "s/POST_TITLE/${TITLE}/g" "$FILEPATH"
sed -i "s/POST_DATE/$(date '+%d %b %Y')/g" "$FILEPATH"
sed -i "s/POST_READ_TIME/5/g" "$FILEPATH"
sed -i "s/POST_CATEGORY/Uncategorized/g" "$FILEPATH"
sed -i "s/POST_DESCRIPTION/A new post about ${TITLE}/g" "$FILEPATH"
sed -i "s/POST_LEAD_PARAGRAPH/Introduction paragraph goes here./g" "$FILEPATH"

echo ""
echo "Created new post: ${FILEPATH}"
echo ""
echo "Next steps:"
echo "1. Edit the post content in ${FILEPATH}"
echo "2. Add the post to posts.html in the post-list section:"
echo ""
echo "   <article class=\"post-card\">"
echo "     <h2 class=\"post-card__title\">"
echo "       <a href=\"posts/${FILENAME}\">${TITLE}</a>"
echo "     </h2>"
echo "     <p class=\"post-card__meta\">$(date '+%d %b %Y') · 5 min read · Category</p>"
echo "     <p class=\"post-card__excerpt\">"
echo "       Brief description of the post..."
echo "     </p>"
echo "   </article>"
echo ""
echo "3. Commit and push to GitHub"
echo ""
