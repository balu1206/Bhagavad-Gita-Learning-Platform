@echo off
cd /d C:\Projects\Bhagavad_Gita_Learning_Platform\gita-app
if exist .git\index.lock del /f /q .git\index.lock

git add -A
git commit -m "redesign: simplify nav/sidebar, hero, footer, gamification, inline audio, word meanings, button styles"
git push origin main
echo DONE
