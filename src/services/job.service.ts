import { prisma } from "@/lib/prisma";
import { CreateJobPayload, UpdateJobPayload } from "@/types/job";

export async function getJobs(search?: string) {
  return prisma.job.findMany({
    where: search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,

    include: {
      candidates: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({
    where: {
      id,
    },
  });
}

export async function createJob(
  data: CreateJobPayload,
  createdById: string
) {
  return prisma.job.create({
    data: {
      title: data.title,
      description: data.description,
      skills: data.skills,

      department: data.department,

      location: data.location,

      employmentType: data.employmentType,

      experience: data.experience,

      salary: data.salary,

      status: "Open",

      createdById,
    },
    cmqtgjvq60000uto0wqj8kykl
  });
}

export async function updateJob(
  data: UpdateJobPayload
) {
  return prisma.job.update({
    where: {
      id: data.id,
    },

    data: {
      title: data.title,

      description: data.description,

      skills: data.skills,

      department: data.department,

      location: data.location,

      employmentType: data.employmentType,

      experience: data.experience,

      salary: data.salary,
    },
  });
}

export async function deleteJob(id: string) {
  return prisma.job.delete({
    where: {
      id,
    },
  });
}

export async function toggleJobStatus(id: string) {
  const job = await prisma.job.findUnique({
    where: {
      id,
    },
  });

  if (!job) throw new Error("Job not found");

  return prisma.job.update({
    where: {
      id,
    },

    data: {
      status:
        job.status === "Open"
          ? "Closed"
          : "Open",
    },
  });
}