# Blog post generator script (PowerShell version)
# Usage: .\new-post.ps1 "Your Post Title"

param(
    [Parameter(Mandatory=$true)]
    [string]$Title
)

$Date = Get-Date -Format "yyyy-MM-dd"
$FormattedDate = Get-Date -Format "dd MMM yyyy"
$Slug = $Title.ToLower() -replace '[^a-z0-9\s-]', '' -replace '\s+', '-'
$Filename = "$Date-$Slug.html"
$Filepath = "posts\$Filename"

# Create the post file from template
Copy-Item -Path "post-template.html" -Destination $Filepath

# Replace placeholders
(Get-Content $Filepath) -replace 'POST_TITLE', $Title `
    -replace 'POST_DATE', $FormattedDate `
    -replace 'POST_READ_TIME', '5' `
    -replace 'POST_CATEGORY', 'Uncategorized' `
    -replace 'POST_DESCRIPTION', "A new post about $Title" `
    -replace 'POST_LEAD_PARAGRAPH', 'Introduction paragraph goes here.' |
    Set-Content $Filepath

Write-Host ""
Write-Host "Created new post: $Filepath" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Edit the post content in $Filepath"
Write-Host "2. Add the post to posts.html in the post-list section:"
Write-Host ""
Write-Host "   <article class=`"post-card`">"
Write-Host "     <h2 class=`"post-card__title`">"
Write-Host "       <a href=`"posts/$Filename`">$Title</a>"
Write-Host "     </h2>"
Write-Host "     <p class=`"post-card__meta`">$FormattedDate · 5 min read · Category</p>"
Write-Host "     <p class=`"post-card__excerpt`">"
Write-Host "       Brief description of the post..."
Write-Host "     </p>"
Write-Host "   </article>"
Write-Host ""
Write-Host "3. Commit and push to GitHub"
Write-Host ""
