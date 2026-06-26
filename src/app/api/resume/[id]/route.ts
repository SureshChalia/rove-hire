import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const candidate = await prisma.candidate.findUnique({
    where: {
      id,
    },
    select: {
      resumeUrl: true,
      name: true,
    },
  });

  if (!candidate?.resumeUrl) {
    return new NextResponse("Resume not found", {
      status: 404,
    });
  }

  const buffer = Buffer.from(candidate.resumeUrl, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${candidate.name}-Resume.pdf"`,
    },
  });
}