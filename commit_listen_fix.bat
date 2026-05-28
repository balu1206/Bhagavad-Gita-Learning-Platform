@echo off
cd /d C:\Projects\Bhagavad_Gita_Learning_Platform\gita-app
if exist .git\index.lock del /f /q .git\index.lock

git add -A
git commit -m "fix(listen): rewrite with Web Speech API, h-dvh layout, simplified controls"
git push origin main
echo DONE
