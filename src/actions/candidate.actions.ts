"use server";

import { revalidatePath } from "next/cache";

import {
  applicationSchema,
  startApplicationSchema,
} from "@/lib/application-validation";

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

  const resume = formData.get("resume") as File | null;

  let resumeUrl = "";

  if (resume && resume.size > 0) {
    if (resume.type !== "application/pdf") {
      throw new Error("Resume must be PDF");
    }

    if (resume.size > 5 * 1024 * 1024) {
      throw new Error("Resume too large");
    }

    resumeUrl = Buffer.from(await resume.arrayBuffer()).toString("base64");
  }

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

  let resumeUrl = existingResumeUrl;

  if (resumeFile && resumeFile.size > 0) {
    if (resumeFile.type !== "application/pdf") {
      throw new Error("Resume must be a PDF.");
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      throw new Error("Resume must be smaller than 5 MB.");
    }

    resumeUrl = Buffer.from(
      await resumeFile.arrayBuffer()
    ).toString("base64");
  }

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
    const resume = formData.get("resume") as File | null;

    if (!resume || resume.size === 0) {
      throw new Error("Upload your resume as a PDF.");
    }

    if (resume.type !== "application/pdf") {
      throw new Error("Resume must be a PDF.");
    }

    if (resume.size > 5 * 1024 * 1024) {
      throw new Error("Resume must be smaller than 5 MB.");
    }

    resumeUrl = Buffer.from(await resume.arrayBuffer()).toString("base64");

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
      console.log("Resume upload failed, but resumeUrl is set. Consider deleting the uploaded resume from storage.");
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
