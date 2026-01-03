# Blog post generator script (PowerShell version) with monthly folder structure
# Usage: .\new-post.ps1 "Your Post Title"

param(
    [Parameter(Mandatory=$true)]
    [string]$Title
)

$Date = Get-Date -Format "yyyy-MM-dd"
$Year = Get-Date -Format "yyyy"
$MonthNum = Get-Date -Format "MM"
$MonthName = (Get-Date -Format "MMMM").ToLower()
$MonthFolder = "$MonthNum-$MonthName"
$FormattedDate = Get-Date -Format "dd MMM yyyy"
$Slug = $Title.ToLower() -replace '[^a-z0-9\s-]', '' -replace '\s+', '-'
$Filename = "$Date-$Slug.html"

# Create month folder if it doesn't exist
$FolderPath = "posts\$Year\$MonthFolder"
New-Item -ItemType Directory -Force -Path $FolderPath | Out-Null

$Filepath = "$FolderPath\$Filename"

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
Write-Host "✓ Created new post: $Filepath" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Edit the post content in $Filepath"
Write-Host "2. Add the post to posts.html in the post-list section (at the TOP):"
Write-Host ""
Write-Host "   <article class=`"post-card`">"
Write-Host "     <h2 class=`"post-card__title`">"
Write-Host "       <a href=`"posts/$Year/$MonthFolder/$Filename`">$Title</a>"
Write-Host "     </h2>"
Write-Host "     <p class=`"post-card__meta`">$FormattedDate · 5 min read · Category</p>"
Write-Host "     <p class=`"post-card__excerpt`">"
Write-Host "       Brief description of the post..."
Write-Host "     </p>"
Write-Host "   </article>"
Write-Host ""
Write-Host "3. Update index.html to show this as the latest post (replace existing Recent Posts)"
Write-Host "4. Commit and push to GitHub:"
Write-Host "   git add ."
Write-Host "   git commit -m `"Add new post: $Title`""
Write-Host "   git push origin main"
Write-Host ""
