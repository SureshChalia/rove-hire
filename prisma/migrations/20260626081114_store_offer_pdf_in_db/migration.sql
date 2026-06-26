-- AlterTable
ALTER TABLE "OfferDocument" ADD COLUMN     "ndaFileName" TEXT,
ADD COLUMN     "ndaFileSize" INTEGER,
ADD COLUMN     "ndaMimeType" TEXT,
ADD COLUMN     "ndaPdf" BYTEA,
ADD COLUMN     "offerFileName" TEXT,
ADD COLUMN     "offerFileSize" INTEGER,
ADD COLUMN     "offerMimeType" TEXT,
ADD COLUMN     "offerPdf" BYTEA,
ALTER COLUMN "offerPdfUrl" DROP NOT NULL,
ALTER COLUMN "ndaPdfUrl" DROP NOT NULL;
