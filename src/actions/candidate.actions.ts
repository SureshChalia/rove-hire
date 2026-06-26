"use server";

import { revalidatePath } from "next/cache";

import {
  applicationSchema,
  startApplicationSchema,
} from "@/lib/application-validation";
import {
  deleteCandidateResume,
  saveCandidateResume,
} from "@/lib/resume";
import {
  createCandidate,
  deleteCandidate,
  startCandidateApplication,
  submitCandidateApplication,
  updateCandidate,
} from "@/services/candidate.service";

function getString(formData: FormData, key: string) {
  return formData.get(key)?.toString() || "";
}

export async function createCandidateAction(formData: FormData) {
  const resumeUrl = await saveCandidateResume(formData.get("resume") as File | null);

  const candidate = await createCandidate({
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

  return {
    success: true,
    applicationPath: `/apply/${candidate.magicToken}`,
  };
}

export async function updateCandidateAction(formData: FormData) {
  const id = getString(formData, "id");
  const resumeFile = formData.get("resume") as File | null;
  const existingResumeUrl = getString(formData, "existingResumeUrl");
  const resumeUrl = resumeFile && resumeFile.size > 0
    ? await saveCandidateResume(resumeFile)
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

export async function startApplicationAction(formData: FormData) {
  const result = startApplicationSchema.safeParse({
    name: getString(formData, "name"),
    email: getString(formData, "email").toLowerCase(),
    jobId: getString(formData, "jobId"),
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || "Check your application details.",
    };
  }

  try {
    const candidate = await startCandidateApplication(result.data);

    return {
      success: true,
      applicationPath: `/apply/${candidate.magicToken}`,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to start your application.",
    };
  }
}

export async function submitApplicationAction(
  token: string,
  formData: FormData
) {
  const result = applicationSchema.safeParse({
    name: getString(formData, "name"),
    email: getString(formData, "email").toLowerCase(),
    phone: getString(formData, "phone"),
    location: getString(formData, "location"),
    currentRole: getString(formData, "currentRole"),
    noticePeriod: getString(formData, "noticePeriod"),
    salaryExpectation: getString(formData, "salaryExpectation"),
    linkedin: getString(formData, "linkedin"),
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || "Check your application details.",
    };
  }

  let resumeUrl = "";

  try {
    resumeUrl = await saveCandidateResume(formData.get("resume") as File | null);

    if (!resumeUrl) {
      throw new Error("Upload your resume as a PDF.");
    }

    const candidate = await submitCandidateApplication(token, {
      ...result.data,
      resumeUrl,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/candidates");
    revalidatePath(`/dashboard/candidates/${candidate.id}`);

    return {
      success: true,
      successPath: `/application-success?reference=${candidate.id}`,
    };
  } catch (error) {
    if (resumeUrl) {
      await deleteCandidateResume(resumeUrl);
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to submit your application.",
    };
  }
}
