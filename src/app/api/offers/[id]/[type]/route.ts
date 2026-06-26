import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
    type: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { id, type } = await params;

  const offer = await prisma.offerDocument.findUnique({
    where: {
      id,
    },
    select: {
      offerPdf: true,
      offerFileName: true,
      offerMimeType: true,

      ndaPdf: true,
      ndaFileName: true,
      ndaMimeType: true,
    },
  });

  if (!offer) {
    return new NextResponse("Offer not found", {
      status: 404,
    });
  }

  if (type === "offer") {
    if (!offer.offerPdf) {
      return new NextResponse("Offer PDF not found", {
        status: 404,
      });
    }

    return new NextResponse(offer.offerPdf, {
      headers: {
        "Content-Type":
          offer.offerMimeType ?? "application/pdf",
        "Content-Disposition": `inline; filename="${offer.offerFileName}"`,
      },
    });
  }

  if (type === "nda") {
    if (!offer.ndaPdf) {
      return new NextResponse("NDA PDF not found", {
        status: 404,
      });
    }

    return new NextResponse(offer.ndaPdf, {
      headers: {
        "Content-Type":
          offer.ndaMimeType ?? "application/pdf",
        "Content-Disposition": `inline; filename="${offer.ndaFileName}"`,
      },
    });
  }

  return new NextResponse("Invalid document type", {
    status: 400,
  });
}