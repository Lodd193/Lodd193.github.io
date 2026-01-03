# Blog Post Workflow

## Quick Start

### Creating a New Post

**Option 1: Using the script (Bash/Git Bash)**
```bash
./new-post.sh "Your Post Title"
```

**Option 2: Using PowerShell**
```powershell
.\new-post.ps1 "Your Post Title"
```

**Option 3: Manual creation**
1. Copy `post-template.html` to `posts/YYYY-MM-DD-post-title.html`
2. Replace all placeholders in the file
3. Write your content

### Placeholders in Template

When creating posts manually, replace these placeholders:
- `POST_TITLE` - Your post title
- `POST_DATE` - Formatted date (e.g., "03 Jan 2026")
- `POST_READ_TIME` - Estimated reading time in minutes
- `POST_CATEGORY` - Category/tag for the post
- `POST_DESCRIPTION` - Meta description for SEO
- `POST_LEAD_PARAGRAPH` - Opening paragraph/summary

### Adding Posts to the Posts Page

After creating a new post, update `posts.html`:

1. Open `posts.html`
2. Find the `<div class="post-list">` section
3. Add your post at the TOP (newest first):

```html
<article class="post-card">
  <h2 class="post-card__title">
    <a href="posts/YYYY/MM-monthname/YYYY-MM-DD-post-title.html">Your Post Title</a>
  </h2>
  <p class="post-card__meta">DD Mon YYYY · X min read · Category</p>
  <p class="post-card__excerpt">
    Brief description of what the post is about...
  </p>
</article>
```

**Note:** Posts are now organized by year and month in folders like `posts/2026/01-january/`

## File Structure

```
github_pages_blog/
├── posts/                                    # All blog posts
│   └── 2026/                                # Year folder
│       ├── 01-january/                      # Month folder
│       │   └── 2026-01-03-post-title.html  # Individual post files
│       ├── 02-february/
│       └── ...
├── index.html                               # Homepage
├── posts.html                               # Posts listing page
├── about.html                               # About page
├── styles.css                               # Stylesheet
├── post-template.html                       # HTML template for new posts
├── POST-TEMPLATE.txt                        # Text template for drafting
├── POST-IDEAS.md                            # Running list of post ideas
├── BLOGGING-PLAN.md                         # Complete blogging plan
├── new-post.sh                              # Bash script to create posts
├── new-post.ps1                             # PowerShell script to create posts
└── BLOG-WORKFLOW.md                         # This file

```

## Publishing to GitHub Pages

```bash
# Check what's changed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Add new post: Your Post Title"

# Push to GitHub
git push origin main
```

Your changes will be live at https://Lodd193.github.io in a few moments.

## Post Writing Tips

1. **Keep the structure consistent** - Use the same H2 headings pattern across posts
2. **Use semantic HTML** - `<code>` for inline code, `<pre><code>` for code blocks
3. **Write the lead paragraph carefully** - It appears at the top and in post listings
4. **Update the meta information** - Reading time, category, and description
5. **Test locally** - Open the HTML file in a browser before pushing

## Common Categories

- Shipping
- Learning
- Building
- Breaking
- Debugging
- Uncategorized
