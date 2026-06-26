import { randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";
import {
  CandidateWithRelations,
  CreateCandidatePayload,
  UpdateCandidatePayload,
} from "@/types/candidate";

const TOKEN_VALIDITY_DAYS = 14;

function createMagicToken() {
  return randomBytes(32).toString("hex");
}

function createTokenExpiry() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + TOKEN_VALIDITY_DAYS);
  return expiry;
}

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
      magicToken: data.magicToken ?? createMagicToken(),
      tokenExpiry: data.tokenExpiry ?? createTokenExpiry(),
      formSubmitted: data.formSubmitted ?? false,
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
  if (rest.magicToken !== undefined) updateData.magicToken = rest.magicToken;
  if (rest.tokenExpiry !== undefined) updateData.tokenExpiry = rest.tokenExpiry;
  if (rest.formSubmitted !== undefined) updateData.formSubmitted = rest.formSubmitted;

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

export async function startCandidateApplication(data: {
  name: string;
  email: string;
  jobId: string;
}) {
  const job = await prisma.job.findFirst({
    where: {
      id: data.jobId,
      status: "Open",
    },
    select: {
      id: true,
    },
  });

  if (!job) {
    throw new Error("This position is no longer accepting applications.");
  }

  const magicToken = createMagicToken();
  const tokenExpiry = createTokenExpiry();
  const existingCandidate = await prisma.candidate.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
      status: true,
      formSubmitted: true,
      jobId: true,
    },
  });

  if (existingCandidate) {
    if (existingCandidate.formSubmitted && existingCandidate.jobId === data.jobId) {
      throw new Error("You have already submitted an application for this role.");
    }

    return prisma.candidate.update({
      where: {
        id: existingCandidate.id,
      },
      data: {
        name: data.name,
        jobId: data.jobId,
        magicToken,
        tokenExpiry,
        formSubmitted: false,
        status:
          existingCandidate.status === "Applied" ||
          existingCandidate.status === "FormSubmitted"
            ? "Applied"
            : existingCandidate.status,
      },
    });
  }

  return prisma.candidate.create({
    data: {
      name: data.name,
      email: data.email,
      resumeUrl: "",
      status: "Applied",
      jobId: data.jobId,
      magicToken,
      tokenExpiry,
      formSubmitted: false,
    },
  });
}

export async function getCandidateApplicationByToken(token: string) {
  return prisma.candidate.findUnique({
    where: {
      magicToken: token,
    },
    include: {
      job: true,
    },
  });
}

export async function submitCandidateApplication(
  token: string,
  data: {
    name: string;
    email: string;
    phone: string;
    location: string;
    currentRole: string;
    noticePeriod: string;
    salaryExpectation: string;
    linkedin: string;
    resumeUrl: string;
  }
) {
  return prisma.$transaction(async (tx) => {
    const candidate = await tx.candidate.findFirst({
      where: {
        magicToken: token,
        tokenExpiry: {
          gt: new Date(),
        },
        formSubmitted: false,
      },
      select: {
        id: true,
        jobId: true,
      },
    });

    if (!candidate) {
      throw new Error("This application link is invalid, expired, or already used.");
    }

    const job = await tx.job.findFirst({
      where: {
        id: candidate.jobId,
        status: "Open",
      },
      select: {
        id: true,
      },
    });

    if (!job) {
      throw new Error("This position is no longer accepting applications.");
    }

    const update = await tx.candidate.updateMany({
      where: {
        id: candidate.id,
        magicToken: token,
        tokenExpiry: {
          gt: new Date(),
        },
        formSubmitted: false,
      },
      data: {
        ...data,
        formSubmitted: true,
        status: "FormSubmitted",
      },
    });

    if (update.count !== 1) {
      throw new Error("This application link has already been used.");
    }

    await tx.timeline.create({
      data: {
        candidateId: candidate.id,
        title: "Form Submitted",
        description: "Candidate completed the public application form.",
      },
    });

    return tx.candidate.findUniqueOrThrow({
      where: {
        id: candidate.id,
      },
    });
  });
}
