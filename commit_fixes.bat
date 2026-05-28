@echo off
cd /d C:\Projects\Bhagavad_Gita_Learning_Platform\gita-app
if exist .git\index.lock del /f /q .git\index.lock
git add src/app/api/admin/seed-verses/route.ts src/app/api/chapters/route.ts
git commit -m "fix: seed verses via Prisma upserts + resilient chapters API fallback"
git push origin main
echo DONE
