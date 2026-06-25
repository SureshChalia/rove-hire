import { prisma } from "@/lib/prisma";
import {
  CandidateWithRelations,
  CreateCandidatePayload,
  UpdateCandidatePayload,
} from "@/types/candidate";

export async function getCandidates(search?: string) {
  const candidates = await prisma.candidate.findMany({
    where: search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              currentRole: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    include: {
      job: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return candidates as CandidateWithRelations[];
}

export async function getCandidateById(id: string) {
  const candidate = await prisma.candidate.findUnique({
    where: {
      id,
    },
    include: {
      job: true,
      interviews: {
        orderBy: {
          interviewDate: "asc",
        },
      },
      timelines: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return candidate as CandidateWithRelations | null;
}

export async function createCandidate(data: CreateCandidatePayload) {
  return prisma.candidate.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      linkedin: data.linkedin ?? null,
      currentRole: data.currentRole ?? null,
      location: data.location ?? null,
      noticePeriod: data.noticePeriod ?? null,
      salaryExpectation: data.salaryExpectation ?? null,
      resumeUrl: data.resumeUrl ?? "",
      status: data.status ?? "Applied",
      jobId: data.jobId,
    },
  });
}

export async function updateCandidate(data: UpdateCandidatePayload) {
  const { id, ...rest } = data;

  const updateData: Record<string, unknown> = {};

  if (rest.name !== undefined) updateData.name = rest.name;
  if (rest.email !== undefined) updateData.email = rest.email;
  if (rest.phone !== undefined) updateData.phone = rest.phone ?? null;
  if (rest.linkedin !== undefined) updateData.linkedin = rest.linkedin ?? null;
  if (rest.currentRole !== undefined) updateData.currentRole = rest.currentRole ?? null;
  if (rest.location !== undefined) updateData.location = rest.location ?? null;
  if (rest.noticePeriod !== undefined) updateData.noticePeriod = rest.noticePeriod ?? null;
  if (rest.salaryExpectation !== undefined) updateData.salaryExpectation = rest.salaryExpectation ?? null;
  if (rest.resumeUrl !== undefined) updateData.resumeUrl = rest.resumeUrl ?? "";
  if (rest.status !== undefined) updateData.status = rest.status;
  if (rest.jobId !== undefined) updateData.jobId = rest.jobId;

  return prisma.candidate.update({
    where: {
      id,
    },
    data: updateData,
  });
}

export async function deleteCandidate(id: string) {
  return prisma.candidate.delete({
    where: {
      id,
    },
  });
}
