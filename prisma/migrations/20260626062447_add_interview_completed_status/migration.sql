/*
  Warnings:

  - You are about to drop the `Resume` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `resumeUrl` on table `Candidate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "CandidateStatus" ADD VALUE 'InterviewCompleted';

-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_candidateId_fkey";

-- AlterTable
ALTER TABLE "Candidate" ALTER COLUMN "resumeUrl" SET NOT NULL;

-- DropTable
DROP TABLE "Resume";
