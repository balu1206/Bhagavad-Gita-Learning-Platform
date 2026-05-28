@echo off
echo Warming function with 6-9 (already done, fast)...
curl -s -X POST "https://bhagavad-gita-learning-platform.vercel.app/api/admin/seed-verses" -H "Content-Type: application/json" -d "{\"secret\":\"gita-2026-seed-unlock\",\"step\":\"verses\",\"from\":6,\"to\":9}"
echo.
echo.
echo Now seeding 1-5 while warm...
curl -s -X POST "https://bhagavad-gita-learning-platform.vercel.app/api/admin/seed-verses" -H "Content-Type: application/json" -d "{\"secret\":\"gita-2026-seed-unlock\",\"step\":\"verses\",\"from\":1,\"to\":5}"
echo.
echo Done.
