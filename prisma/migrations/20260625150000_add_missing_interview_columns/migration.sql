-- Keep the database in sync with the Interview model.
-- IF NOT EXISTS also supports databases where the old runtime workaround
-- already created some of these columns.
ALTER TABLE "Interview"
ADD COLUMN IF NOT EXISTS "interviewTime" TEXT,
ADD COLUMN IF NOT EXISTS "duration" TEXT,
ADD COLUMN IF NOT EXISTS "meetingLink" TEXT,
ADD COLUMN IF NOT EXISTS "rating" INTEGER;
