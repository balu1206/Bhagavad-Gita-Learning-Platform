@echo off
cd /d C:\Projects\Bhagavad_Gita_Learning_Platform\gita-app
if exist .git\index.lock del /f /q .git\index.lock
git add src/app/api/admin/seed-verses/route.ts
git commit -m "fix(seed): use Prisma.VerseCreateManyInput type to fix TS build error on createMany"
git push origin main
echo DONE
