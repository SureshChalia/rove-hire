"use server";

import { revalidatePath } from "next/cache";
import {
  changeInterviewStatus,
  completeInterview,
  createInterview,
  deleteInterview,
  updateInterview,
} from "@/services/interview.service";

export async function createInterviewAction(formData: FormData) {
  const candidateId = formData.get("candidateId")?.toString() || "";
  const interviewer = formData.get("interviewer")?.toString() || "";
  const type = formData.get("type")?.toString() as "Screening" | "Technical";
  const interviewDate = formData.get("interviewDate")?.toString() || "";
  const interviewTime = formData.get("interviewTime")?.toString() || "";
  const duration = formData.get("duration")?.toString() || "";
  const meetingLink = formData.get("meetingLink")?.toString() || "";
  const notes = formData.get("notes")?.toString() || "";

  await createInterview({
    candidateId,
    interviewer,
    type,
    interviewDate: new Date(interviewDate),
    interviewTime,
    duration,
    meetingLink: meetingLink || null,
    notes: notes || null,
  });

  revalidatePath("/dashboard/interviews");
  revalidatePath("/dashboard");
}

export async function updateInterviewAction(formData: FormData) {
  const id = formData.get("id")?.toString() || "";
  const candidateId = formData.get("candidateId")?.toString() || "";
  const interviewer = formData.get("interviewer")?.toString() || "";
  const type = formData.get("type")?.toString() as "Screening" | "Technical";
  const interviewDate = formData.get("interviewDate")?.toString() || "";
  const interviewTime = formData.get("interviewTime")?.toString() || "";
  const duration = formData.get("duration")?.toString() || "";
  const meetingLink = formData.get("meetingLink")?.toString() || "";
  const notes = formData.get("notes")?.toString() || "";
  const status = formData.get("status")?.toString() as "Scheduled" | "Completed" | "Cancelled";

  await updateInterview({
    id,
    candidateId,
    interviewer,
    type,
    interviewDate: interviewDate ? new Date(interviewDate) : undefined,
    interviewTime,
    duration,
    meetingLink: meetingLink || null,
    notes: notes || null,
    status,
  });

  revalidatePath("/dashboard/interviews");
  revalidatePath("/dashboard");
}

export async function deleteInterviewAction(id: string) {
  await deleteInterview(id);

  revalidatePath("/dashboard/interviews");
  revalidatePath("/dashboard");
}

export async function completeInterviewAction(
  id: string,
  recommendation: "Hire" | "Maybe" |  "NoHire",
  feedback?: string | null,
  rating?: number | null
) {
  await completeInterview(id, recommendation, feedback, rating);

  revalidatePath("/dashboard/interviews");
  revalidatePath("/dashboard");
}

export async function changeInterviewStatusAction(id: string, status: string) {
  await changeInterviewStatus(id, status);

  revalidatePath("/dashboard/interviews");
  revalidatePath("/dashboard");
}
