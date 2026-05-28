@echo off
cd /d C:\Projects\Bhagavad_Gita_Learning_Platform\gita-app
if exist .git\index.lock del /f /q .git\index.lock

git add -A
git commit -m "fix(shell): split reader-mode wrapper — verse pages scrollable, listen page h-dvh"
git push origin main
echo DONE
