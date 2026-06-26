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
  });

  const typedOffer = offer as
    | (typeof offer & {
        offerPdf?: Uint8Array | Buffer | null;
        offerFileName?: string | null;
        offerMimeType?: string | null;
        ndaPdf?: Uint8Array | Buffer | null;
        ndaFileName?: string | null;
        ndaMimeType?: string | null;
      })
    | null;

  if (!typedOffer) {
    return new NextResponse("Offer not found", {
      status: 404,
    });
  }

  if (type === "offer") {
    if (!typedOffer.offerPdf) {
      return new NextResponse("Offer PDF not found", {
        status: 404,
      });
    }

    return new NextResponse(typedOffer.offerPdf, {
      headers: {
        "Content-Type": typedOffer.offerMimeType ?? "application/pdf",
        "Content-Disposition": `inline; filename="${typedOffer.offerFileName}"`,
      },
    });
  }

  if (type === "nda") {
    if (!typedOffer.ndaPdf) {
      return new NextResponse("NDA PDF not found", {
        status: 404,
      });
    }

    return new NextResponse(typedOffer.ndaPdf, {
      headers: {
        "Content-Type": typedOffer.ndaMimeType ?? "application/pdf",
        "Content-Disposition": `inline; filename="${typedOffer.ndaFileName}"`,
      },
    });
  }

  return new NextResponse("Invalid document type", {
    status: 400,
  });
}