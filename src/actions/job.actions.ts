"use server";

import { revalidatePath } from "next/cache";

import {
  createJob,
  deleteJob,
  toggleJobStatus,
  updateJob,
} from "@/services/job.service";

export async function createJobAction(
  formData: FormData
) {
  const title =
    formData.get("title")?.toString() || "";

  const description =
    formData.get("description")?.toString() ||
    "";

  const skills =
    formData
      .get("skills")
      ?.toString()
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean) || [];

  await createJob(
    {
      title,
      description,
      skills,

      department:
        formData
          .get("department")
          ?.toString(),

      location:
        formData
          .get("location")
          ?.toString(),

      employmentType:
        formData
          .get("employmentType")
          ?.toString(),

      experience:
        formData
          .get("experience")
          ?.toString(),

      salary:
        formData
          .get("salary")
          ?.toString(),
    },

    "cmqtgjvq60000uto0wqj8kykl"
  );

  revalidatePath("/dashboard/jobs");
}

export async function updateJobAction(
  formData: FormData
) {
  const id =
    formData.get("id")?.toString() || "";

  const title =
    formData.get("title")?.toString() || "";

  const description =
    formData.get("description")?.toString() ||
    "";

  const skills =
    formData
      .get("skills")
      ?.toString()
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean) || [];

  await updateJob({
    id,

    title,

    description,

    skills,

    department:
      formData
        .get("department")
        ?.toString(),

    location:
      formData
        .get("location")
        ?.toString(),

    employmentType:
      formData
        .get("employmentType")
        ?.toString(),

    experience:
      formData
        .get("experience")
        ?.toString(),

    salary:
      formData
        .get("salary")
        ?.toString(),
  });

  revalidatePath("/dashboard/jobs");
}

export async function deleteJobAction(
  id: string
) {
  await deleteJob(id);

  revalidatePath("/dashboard/jobs");
}

export async function toggleJobStatusAction(
  id: string
) {
  await toggleJobStatus(id);

  revalidatePath("/dashboard/jobs");
}