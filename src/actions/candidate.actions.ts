"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

import {
  createCandidate,
  deleteCandidate,
  updateCandidate,
} from "@/services/candidate.service";

async function saveResume(file: File | null) {
  if (!file || file.size === 0) {
    return "";
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "candidates");

  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/uploads/candidates/${fileName}`;
}

function getString(formData: FormData, key: string) {
  return formData.get(key)?.toString() || "";
}

export async function createCandidateAction(formData: FormData) {
  const resumeUrl = await saveResume(formData.get("resume") as File | null);

  await createCandidate({
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone") || null,
    linkedin: getString(formData, "linkedin") || null,
    currentRole: getString(formData, "currentRole") || null,
    location: getString(formData, "location") || null,
    noticePeriod: getString(formData, "noticePeriod") || null,
    salaryExpectation: getString(formData, "salaryExpectation") || null,
    jobId: getString(formData, "jobId"),
    resumeUrl,
  });

  revalidatePath("/dashboard/candidates");
}

export async function updateCandidateAction(formData: FormData) {
  const id = getString(formData, "id");
  const resumeFile = formData.get("resume") as File | null;
  const existingResumeUrl = getString(formData, "existingResumeUrl");
  const resumeUrl = resumeFile && resumeFile.size > 0
    ? await saveResume(resumeFile)
    : existingResumeUrl;

  await updateCandidate({
    id,
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone") || null,
    linkedin: getString(formData, "linkedin") || null,
    currentRole: getString(formData, "currentRole") || null,
    location: getString(formData, "location") || null,
    noticePeriod: getString(formData, "noticePeriod") || null,
    salaryExpectation: getString(formData, "salaryExpectation") || null,
    jobId: getString(formData, "jobId"),
    resumeUrl,
  });

  revalidatePath("/dashboard/candidates");
  revalidatePath(`/dashboard/candidates/${id}`);
}

export async function deleteCandidateAction(id: string) {
  await deleteCandidate(id);

  revalidatePath("/dashboard/candidates");
  revalidatePath(`/dashboard/candidates/${id}`);
}
