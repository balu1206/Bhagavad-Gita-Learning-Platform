@echo off
cd /d C:\Projects\Bhagavad_Gita_Learning_Platform\gita-app
if exist .git\index.lock del /f /q .git\index.lock

git add -A
git commit -m "feat(verse): pause/resume, word highlighting, translation + full reading mode"
git push origin main
echo DONE
