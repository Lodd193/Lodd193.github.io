# Scheduled Posts

This site now supports automatic scheduled publishing using GitHub Actions!

## How It Works

1. **Write your post** in the `drafts/` folder with a special filename format
2. **Push to GitHub** - the post stays hidden until its scheduled time
3. **GitHub Actions runs hourly** and checks for posts ready to publish
4. **Automatic publishing** - posts are moved to the `posts/` folder and added to the homepage and posts page

## Filename Format

Scheduled posts must follow this naming convention:

```
YYYY-MM-DD-HH-MM-title.html
```

**Examples:**
- `2026-01-07-19-00-github-project-management.html` - Publishes on Jan 7, 2026 at 19:00 (7 PM)
- `2026-01-15-09-30-python-tips.html` - Publishes on Jan 15, 2026 at 09:30 (9:30 AM)
- `2026-02-01-12-00-data-science-workflow.html` - Publishes on Feb 1, 2026 at 12:00 (noon)

## Folder Structure

```
drafts/
└── 2026/
    └── 01-january/
        └── 2026-01-07-19-00-github-project-management.html
```

Mirror the same folder structure as the `posts/` directory.

## Creating a Scheduled Post

1. **Copy the post template** from `post-template.html`
2. **Save it in the drafts folder** with the scheduled date/time in the filename
3. **Write your content** using the same structure as published posts
4. **Commit and push** to GitHub

```bash
# Create the draft
cp post-template.html drafts/2026/01-january/2026-01-10-14-00-my-new-post.html

# Edit the file with your content
# ...

# Commit and push
git add drafts/
git commit -m "Add scheduled post for Jan 10"
git push
```

## What Happens Automatically

When the scheduled time arrives, GitHub Actions will:

1. ✅ Move the post from `drafts/` to `posts/`
2. ✅ Add the post card to `posts.html`
3. ✅ Add the post card to `index.html` (Recent Posts)
4. ✅ Update post statistics (total count, category count)
5. ✅ Update "Last post" date in the sidebar
6. ✅ Commit and push the changes automatically

## Manual Publishing

You can also manually trigger the publishing workflow:

1. Go to **Actions** tab on GitHub
2. Click **Publish Scheduled Posts**
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

This is useful for testing or publishing posts immediately.

## Checking Scheduled Posts

To see what posts are scheduled:

```bash
# List all draft posts
ls -R drafts/

# Check when a specific post will publish
# (look at the date/time in the filename)
```

## Time Zone

All times are in UTC. GitHub Actions runs on UTC time, so adjust your scheduled times accordingly.

**Example:** If you want to publish at 7 PM UK time (GMT):
- **Winter (GMT):** Use `19-00` in the filename
- **Summer (BST):** Use `18-00` in the filename (BST is UTC+1)

## Workflow Schedule

The GitHub Actions workflow runs:
- **Every hour** at the top of the hour (00 minutes past)
- Example: 09:00, 10:00, 11:00, etc.

So if you schedule a post for 19:00, it will be published when the workflow runs at 19:00 UTC.

## Troubleshooting

**Post didn't publish at the scheduled time:**
- Check the filename format is correct: `YYYY-MM-DD-HH-MM-title.html`
- Verify the date/time hasn't passed yet (remember, it's UTC)
- Check the Actions tab on GitHub for workflow errors
- Wait for the next hourly workflow run

**Post published but looks broken:**
- Ensure all metadata in the HTML is correct (title, date, category, description)
- Check that image paths and links use correct relative paths (`../../../`)
- Verify the post structure matches the template

## Example: Your First Scheduled Post

The file `drafts/2026/01-january/2026-01-07-19-00-github-project-management.html` is scheduled to publish on:

**📅 Wednesday, January 7, 2026 at 19:00 UTC (7:00 PM)**

This post will automatically appear on your site when that time arrives!

---

*This automated publishing system uses GitHub Actions and was built using Claude Code.*
