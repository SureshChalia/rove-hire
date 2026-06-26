import { CandidateStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CreateOfferPayload,
  OfferPdfBytes,
  OfferRecord,
  UpdateOfferPayload,
} from "@/types/offer";

const offerInclude = {
  candidate: {
    include: {
      job: true,
    },
  },
} as const;

function toUint8Array(value: OfferPdfBytes): Uint8Array<ArrayBuffer> {
  if (value instanceof Uint8Array) {
    const bytes = value.buffer.slice(
      value.byteOffset,
      value.byteOffset + value.byteLength
    ) as ArrayBuffer;

    return new Uint8Array(bytes) as Uint8Array<ArrayBuffer>;
  }

  return new Uint8Array(value.slice(0)) as Uint8Array<ArrayBuffer>;
}

export async function getOffers(search?: string) {
  const offers = await prisma.offerDocument.findMany({
    where: search
      ? {
          OR: [
            {
              roleTitle: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              candidate: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      : undefined,
    include: offerInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return offers as OfferRecord[];
}

export async function getOfferById(id: string) {
  const offer = await prisma.offerDocument.findUnique({
    where: {
      id,
    },
    include: offerInclude,
  });

  return offer as OfferRecord | null;
}

export async function createOffer(data: CreateOfferPayload) {
  return prisma.$transaction(async (tx) => {
    const offer = await tx.offerDocument.create({
      data: {
        candidateId: data.candidateId,
        roleTitle: data.roleTitle,
        salary: data.salary,
        startDate: data.startDate,
        reportingManager: data.reportingManager,
        location: data.location,
        offerPdf: toUint8Array(data.offerPdf),
        offerFileName: data.offerFileName,
        offerMimeType: data.offerMimeType,
        offerFileSize: data.offerFileSize,
        ndaPdf: toUint8Array(data.ndaPdf),
        ndaFileName: data.ndaFileName,
        ndaMimeType: data.ndaMimeType,
        ndaFileSize: data.ndaFileSize,
      },
      include: offerInclude,
    });

    await tx.candidate.update({
      where: {
        id: data.candidateId,
      },
      data: {
        status: CandidateStatus.OfferSent,
      },
    });

    await tx.timeline.create({
      data: {
        candidateId: data.candidateId,
        title: "Offer Sent",
        description: `Offer generated for the ${data.roleTitle} role.`,
      },
    });

    return offer;
  });
}

export async function updateOffer(data: UpdateOfferPayload) {
  return prisma.$transaction(async (tx) => {
    const currentOffer = await tx.offerDocument.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!currentOffer) {
      throw new Error("Offer not found");
    }

    const offer = await tx.offerDocument.update({
      where: {
        id: data.id,
      },
      data: {
        candidateId: data.candidateId,
        roleTitle: data.roleTitle,
        salary: data.salary,
        startDate: data.startDate,
        reportingManager: data.reportingManager,
        location: data.location,
        offerPdf: toUint8Array(data.offerPdf),
        offerFileName: data.offerFileName,
        offerMimeType: data.offerMimeType,
        offerFileSize: data.offerFileSize,
        ndaPdf: toUint8Array(data.ndaPdf),
        ndaFileName: data.ndaFileName,
        ndaMimeType: data.ndaMimeType,
        ndaFileSize: data.ndaFileSize,
      },
      include: offerInclude,
    });

    if (currentOffer.candidateId !== data.candidateId) {
      await tx.candidate.update({
        where: {
          id: data.candidateId,
        },
        data: {
          status: CandidateStatus.OfferSent,
        },
      });

      await tx.timeline.create({
        data: {
          candidateId: data.candidateId,
          title: "Offer Sent",
          description: `Offer generated for the ${data.roleTitle} role.`,
        },
      });
    }

    return offer;
  });
}

export async function deleteOffer(id: string) {
  return prisma.offerDocument.delete({
    where: {
      id,
    },
  });
}

export async function markOfferAccepted(id: string) {
  return prisma.$transaction(async (tx) => {
    const offer = await tx.offerDocument.findUnique({
      where: {
        id,
      },
      include: offerInclude,
    });

    if (!offer) {
      throw new Error("Offer not found");
    }

    if (offer.candidate.status !== CandidateStatus.Hired) {
      await tx.candidate.update({
        where: {
          id: offer.candidateId,
        },
        data: {
          status: CandidateStatus.Hired,
        },
      });

      await tx.timeline.create({
        data: {
          candidateId: offer.candidateId,
          title: "Offer Accepted",
          description: `Candidate accepted the offer for ${offer.roleTitle}.`,
        },
      });
    }

    return offer;
  });
}

export async function markOfferRejected(id: string) {
  return prisma.$transaction(async (tx) => {
    const offer = await tx.offerDocument.findUnique({
      where: {
        id,
      },
      include: offerInclude,
    });

    if (!offer) {
      throw new Error("Offer not found");
    }

    if (offer.candidate.status !== CandidateStatus.Rejected) {
      await tx.candidate.update({
        where: {
          id: offer.candidateId,
        },
        data: {
          status: CandidateStatus.Rejected,
        },
      });

      await tx.timeline.create({
        data: {
          candidateId: offer.candidateId,
          title: "Offer Rejected",
          description: `Candidate rejected the offer for ${offer.roleTitle}.`,
        },
      });
    }

    return offer;
  });
}
