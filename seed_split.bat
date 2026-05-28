@echo off
echo Seeding verses ch 1-5...
curl -s -X POST "https://bhagavad-gita-learning-platform.vercel.app/api/admin/seed-verses" -H "Content-Type: application/json" -d "{\"secret\":\"gita-2026-seed-unlock\",\"step\":\"verses\",\"from\":1,\"to\":5}"
echo.
echo.
echo Waiting 5s...
timeout /t 5 /nobreak > nul
echo Seeding verses ch 6-9...
curl -s -X POST "https://bhagavad-gita-learning-platform.vercel.app/api/admin/seed-verses" -H "Content-Type: application/json" -d "{\"secret\":\"gita-2026-seed-unlock\",\"step\":\"verses\",\"from\":6,\"to\":9}"
echo.
echo Done.
