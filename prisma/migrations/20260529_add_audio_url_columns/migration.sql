-- AlterTable
ALTER TABLE "Verse" ADD COLUMN IF NOT EXISTS "audioSanskrit" TEXT;
ALTER TABLE "Verse" ADD COLUMN IF NOT EXISTS "audioTranslation" TEXT;
ALTER TABLE "Verse" ADD COLUMN IF NOT EXISTS "audioCommentary" TEXT;
