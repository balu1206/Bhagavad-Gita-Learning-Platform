@echo off
echo Seeding chapters...
curl -s -X POST "https://bhagavad-gita-learning-platform.vercel.app/api/admin/seed-verses" -H "Content-Type: application/json" -d "{\"secret\":\"gita-2026-seed-unlock\",\"step\":\"chapters\"}"
echo.
echo.
echo Seeding verses 1-9...
curl -s -X POST "https://bhagavad-gita-learning-platform.vercel.app/api/admin/seed-verses" -H "Content-Type: application/json" -d "{\"secret\":\"gita-2026-seed-unlock\",\"step\":\"verses\",\"from\":1,\"to\":9}"
echo.
echo.
echo Seeding verses 10-18...
curl -s -X POST "https://bhagavad-gita-learning-platform.vercel.app/api/admin/seed-verses" -H "Content-Type: application/json" -d "{\"secret\":\"gita-2026-seed-unlock\",\"step\":\"verses\",\"from\":10,\"to\":18}"
echo.
echo.
echo Done.
