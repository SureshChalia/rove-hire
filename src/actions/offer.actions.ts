"use server";

import { revalidatePath } from "next/cache";

import {
  generateNdaPdf,
  generateOfferLetterPdf,
  saveOfferPdf,
} from "@/lib/pdf";

import { getCandidateById } from "@/services/candidate.service";
import {
  createOffer,
  deleteOffer,
  getOfferById,
  markOfferAccepted,
  markOfferRejected,
  updateOffer,
} from "@/services/offer.service";
import type { OfferActionResult, OfferPdfInput } from "@/types/offer";

function getString(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || "";
}

function revalidateOfferPaths(id?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/offers");
  revalidatePath("/dashboard/candidates");

  if (id) {
    revalidatePath(`/dashboard/offers/${id}`);
  }
}

async function createDocuments(input: OfferPdfInput) {
  const [offerBytes, ndaBytes] = await Promise.all([
    generateOfferLetterPdf(input),
    generateNdaPdf(input),
  ]);

  const offerPdf = await saveOfferPdf(
    offerBytes,
    input.candidateName,
    "offer-letter"
  );

  const ndaPdf = await saveOfferPdf(
    ndaBytes,
    input.candidateName,
    "nda"
  );

  return {
    offerPdf,
    ndaPdf,
  };
}

async function readOfferForm(formData: FormData) {
  const candidateId = getString(formData, "candidateId");
  const roleTitle = getString(formData, "roleTitle");
  const salary = getString(formData, "salary");
  const startDateValue = getString(formData, "startDate");
  const reportingManager = getString(formData, "reportingManager");
  const location = getString(formData, "location");
  const notes = getString(formData, "notes");

  if (
    !candidateId ||
    !roleTitle ||
    !salary ||
    !startDateValue ||
    !reportingManager ||
    !location
  ) {
    throw new Error("Please complete all required offer fields.");
  }

  const startDate = new Date(`${startDateValue}T00:00:00`);

  if (Number.isNaN(startDate.getTime())) {
    throw new Error("Enter a valid joining date.");
  }

  const candidate = await getCandidateById(candidateId);

  if (!candidate) {
    throw new Error("Candidate not found.");
  }

  return {
    candidateId,
    roleTitle,
    salary,
    startDate,
    reportingManager,
    location,
    notes,
    candidate,
  };
}

export async function createOfferAction(
  formData: FormData
): Promise<OfferActionResult> {
  try {
    const data = await readOfferForm(formData);

    const documents = await createDocuments({
      candidateName: data.candidate.name,
      candidateEmail: data.candidate.email,
      roleTitle: data.roleTitle,
      salary: data.salary,
      startDate: data.startDate,
      reportingManager: data.reportingManager,
      location: data.location,
      notes: data.notes || null,
    });

    await createOffer({
      candidateId: data.candidateId,

      roleTitle: data.roleTitle,
      salary: data.salary,
      startDate: data.startDate,

      reportingManager: data.reportingManager,
      location: data.location,

      offerPdf: documents.offerPdf.data,
      offerFileName: documents.offerPdf.fileName,
      offerMimeType: documents.offerPdf.mimeType,
      offerFileSize: documents.offerPdf.fileSize,

      ndaPdf: documents.ndaPdf.data,
      ndaFileName: documents.ndaPdf.fileName,
      ndaMimeType: documents.ndaPdf.mimeType,
      ndaFileSize: documents.ndaPdf.fileSize,
    });

    revalidateOfferPaths();

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create the offer.",
    };
  }
}

export async function updateOfferAction(
  formData: FormData
): Promise<OfferActionResult> {
  try {
    const id = getString(formData, "id");

    if (!id) {
      throw new Error("Offer not found.");
    }

    const [currentOffer, data] = await Promise.all([
      getOfferById(id),
      readOfferForm(formData),
    ]);

    if (!currentOffer) {
      throw new Error("Offer not found.");
    }

    const documents = await createDocuments({
      candidateName: data.candidate.name,
      candidateEmail: data.candidate.email,
      roleTitle: data.roleTitle,
      salary: data.salary,
      startDate: data.startDate,
      reportingManager: data.reportingManager,
      location: data.location,
      notes: data.notes || null,
    });

    await updateOffer({
      id,

      candidateId: data.candidateId,

      roleTitle: data.roleTitle,
      salary: data.salary,
      startDate: data.startDate,

      reportingManager: data.reportingManager,
      location: data.location,

      offerPdf: documents.offerPdf.data,
      offerFileName: documents.offerPdf.fileName,
      offerMimeType: documents.offerPdf.mimeType,
      offerFileSize: documents.offerPdf.fileSize,

      ndaPdf: documents.ndaPdf.data,
      ndaFileName: documents.ndaPdf.fileName,
      ndaMimeType: documents.ndaPdf.mimeType,
      ndaFileSize: documents.ndaPdf.fileSize,
    });

    revalidateOfferPaths(id);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update the offer.",
    };
  }
}

export async function deleteOfferAction(
  id: string
): Promise<OfferActionResult> {
  try {
    const offer = await getOfferById(id);

    if (!offer) {
      throw new Error("Offer not found.");
    }

    await deleteOffer(id);

    revalidateOfferPaths(id);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete the offer.",
    };
  }
}

export async function markOfferAcceptedAction(
  id: string
): Promise<OfferActionResult> {
  try {
    await markOfferAccepted(id);
    revalidateOfferPaths(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to accept the offer.",
    };
  }
}

export async function markOfferRejectedAction(
  id: string
): Promise<OfferActionResult> {
  try {
    await markOfferRejected(id);
    revalidateOfferPaths(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unable to reject the offer.",
    };
  }
}
