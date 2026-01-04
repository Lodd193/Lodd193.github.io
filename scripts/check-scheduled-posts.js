const fs = require('fs');
const path = require('path');

// Parse date from filename: YYYY-MM-DD-HH-MM-title.html
function parseScheduledDate(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-/);
  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  return new Date(year, month - 1, day, hour, minute);
}

// Extract post metadata from HTML file
function extractPostMeta(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Extract title from <h1> tag in article
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled Post';

  // Extract date from article__meta
  const dateMatch = html.match(/<time datetime="([^"]+)">([^<]+)<\/time>/);
  const dateStr = dateMatch ? dateMatch[2].trim() : '';

  // Extract read time
  const readTimeMatch = html.match(/(\d+)\s*min read/);
  const readTime = readTimeMatch ? readTimeMatch[1] : '5';

  // Extract category
  const categoryMatch = html.match(/>(🚀 Shipping|📚 Learning|🔨 Building|🐛 Debugging)</);
  const category = categoryMatch ? categoryMatch[1] : '📚 Learning';
  const categoryIcon = category.split(' ')[0];
  const categoryName = category.split(' ')[1];

  // Extract description from article__lead or first <p>
  const descMatch = html.match(/<p class="article__lead"[^>]*>(.*?)<\/p>/) ||
                    html.match(/<p>(.*?)<\/p>/);
  const description = descMatch ? descMatch[1].trim() : '';

  return { title, dateStr, readTime, category, categoryIcon, categoryName, description };
}

// Update posts.html with new post
function updatePostsPage(postPath, meta) {
  const postsHtml = fs.readFileSync('posts.html', 'utf8');

  // Create new post card HTML
  const postCard = `
        <article class="post-card">
          <div class="post-card__tag">${meta.category}</div>
          <h3>
            <a href="${postPath}">${meta.title}</a>
          </h3>
          <p class="post-card__meta">
            <span class="meta-item">📅 ${meta.dateStr}</span>
            <span class="meta-item">⏱️ ${meta.readTime} min read</span>
          </p>
          <p class="post-card__desc">
            ${meta.description}
          </p>
        </article>
`;

  // Insert after "<!-- Add new posts here in reverse chronological order -->"
  const insertMarker = '<!-- Add new posts here in reverse chronological order -->';
  const updated = postsHtml.replace(insertMarker, insertMarker + '\n' + postCard);

  // Update total posts count
  const totalPostsMatch = updated.match(/<div class="stat-value">(\d+)<\/div>\s*<div class="stat-label">Total Posts<\/div>/);
  if (totalPostsMatch) {
    const currentCount = parseInt(totalPostsMatch[1]);
    const newCount = currentCount + 1;
    const updatedWithCount = updated.replace(
      totalPostsMatch[0],
      `<div class="stat-value">${newCount}</div>\n        <div class="stat-label">Total Posts</div>`
    );

    fs.writeFileSync('posts.html', updatedWithCount, 'utf8');
  } else {
    fs.writeFileSync('posts.html', updated, 'utf8');
  }
}

// Update index.html with new post
function updateIndexPage(postPath, meta) {
  const indexHtml = fs.readFileSync('index.html', 'utf8');

  // Create new post card HTML
  const postCard = `
            <article class="post-card">
              <div class="post-card__tag">${meta.category}</div>
              <h3>
                <a href="${postPath}">${meta.title}</a>
              </h3>
              <p class="post-card__meta">
                <span class="meta-item">📅 ${meta.dateStr}</span>
                <span class="meta-item">⏱️ ${meta.readTime} min read</span>
              </p>
              <p class="post-card__desc">
                ${meta.description}
              </p>
            </article>
`;

  // Insert at the beginning of post-list div
  const updated = indexHtml.replace(
    /<div class="post-list">/,
    `<div class="post-list">\n${postCard}`
  );

  // Update category count in sidebar
  const categoryPattern = new RegExp(
    `<span class="category-icon">${meta.categoryIcon}</span>\\s*<span class="category-badge__name">${meta.categoryName}</span>\\s*<span class="category-badge__count">(\\d+)</span>`,
    's'
  );
  const categoryMatch = updated.match(categoryPattern);
  if (categoryMatch) {
    const currentCount = parseInt(categoryMatch[1]);
    const newCount = currentCount + 1;
    const updatedWithCategory = updated.replace(categoryMatch[0], categoryMatch[0].replace(currentCount.toString(), newCount.toString()));

    // Update Recent Activity stats
    const totalPostsPattern = /<div class="activity-label">Total posts<\/div>\s*<div class="activity-value">(\d+)<\/div>/s;
    const totalMatch = updatedWithCategory.match(totalPostsPattern);
    if (totalMatch) {
      const currentTotal = parseInt(totalMatch[1]);
      const newTotal = currentTotal + 1;
      const finalUpdated = updatedWithCategory.replace(totalMatch[0], totalMatch[0].replace(currentTotal.toString(), newTotal.toString()));

      // Update "Last post" date
      const lastPostPattern = /<div class="activity-label">Last post<\/div>\s*<div class="activity-value">([^<]+)<\/div>/s;
      const lastPostUpdated = finalUpdated.replace(lastPostPattern, `<div class="activity-label">Last post</div>\n                <div class="activity-value">${meta.dateStr}</div>`);

      fs.writeFileSync('index.html', lastPostUpdated, 'utf8');
    } else {
      fs.writeFileSync('index.html', updatedWithCategory, 'utf8');
    }
  } else {
    fs.writeFileSync('index.html', updated, 'utf8');
  }
}

// Main function
function checkAndPublishPosts() {
  const now = new Date();
  console.log(`Checking for scheduled posts at ${now.toISOString()}`);

  const draftsDir = 'drafts';
  if (!fs.existsSync(draftsDir)) {
    console.log('No drafts directory found');
    return;
  }

  let publishedCount = 0;

  // Recursively search for HTML files in drafts
  function searchDrafts(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        searchDrafts(fullPath);
      } else if (entry.name.endsWith('.html')) {
        const scheduledDate = parseScheduledDate(entry.name);

        if (scheduledDate && scheduledDate <= now) {
          console.log(`✅ Publishing: ${entry.name} (scheduled for ${scheduledDate.toISOString()})`);

          // Determine destination path
          const relativePath = path.relative(draftsDir, fullPath);
          const destPath = path.join('posts', relativePath);
          const destDir = path.dirname(destPath);

          // Create destination directory if needed
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }

          // Move file
          fs.renameSync(fullPath, destPath);

          // Extract metadata
          const meta = extractPostMeta(destPath);

          // Update HTML pages
          const webPath = destPath.replace(/\\/g, '/');
          updatePostsPage(webPath, meta);
          updateIndexPage(webPath, meta);

          publishedCount++;
          console.log(`  📝 Updated posts.html and index.html`);
        } else if (scheduledDate) {
          console.log(`⏳ Not yet: ${entry.name} (scheduled for ${scheduledDate.toISOString()})`);
        }
      }
    }
  }

  searchDrafts(draftsDir);

  if (publishedCount === 0) {
    console.log('No posts ready to publish');
  } else {
    console.log(`\n🎉 Published ${publishedCount} post(s)`);
  }
}

checkAndPublishPosts();
