/*
  Warnings:

  - You are about to drop the column `ndaPdfUrl` on the `OfferDocument` table. All the data in the column will be lost.
  - You are about to drop the column `offerPdfUrl` on the `OfferDocument` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OfferDocument" DROP COLUMN "ndaPdfUrl",
DROP COLUMN "offerPdfUrl";
