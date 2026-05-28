$repo = "C:\Projects\Bhagavad_Gita_Learning_Platform\gita-app"
$lock = "$repo\.git\index.lock"

if (Test-Path $lock) {
    Remove-Item -Force $lock
    Write-Host "Lock file removed"
} else {
    Write-Host "No lock file"
}

Set-Location $repo

$env:GIT_AUTHOR_NAME = "bhaskar"
$env:GIT_AUTHOR_EMAIL = "balu.svb000@gmail.com"
$env:GIT_COMMITTER_NAME = "bhaskar"
$env:GIT_COMMITTER_EMAIL = "balu.svb000@gmail.com"

git add src/app/api/admin/seed-verses/route.ts src/app/api/chapters/route.ts
Write-Host "Files staged"

git commit -m "fix: seed verses via Prisma upserts + resilient chapters API fallback"
Write-Host "Committed"

git push origin main
Write-Host "Pushed"
