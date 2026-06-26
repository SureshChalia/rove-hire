import type { CandidateRecord } from "./candidate";

export type OfferStatus = "Sent" | "Accepted" | "Rejected";
export type OfferPdfBytes = Uint8Array | ArrayBuffer;

export interface OfferCandidateSummary {
  id: string;
  name: string;
  email: string;
  status: string;
  job?: {
    id: string;
    title: string;
  } | null;
}

export interface OfferRecord {
  id: string;
  roleTitle: string;
  salary: string;
  startDate: Date;
  reportingManager: string;
  location: string;
  offerPdf?: OfferPdfBytes | null;
  ndaPdf?: OfferPdfBytes | null;
  offerFileName?: string | null;
  offerMimeType?: string | null;
  offerFileSize?: number | null;
  ndaFileName?: string | null;
  ndaMimeType?: string | null;
  ndaFileSize?: number | null;
  createdAt: Date;
  candidateId: string;
  candidate: CandidateRecord;
}

export interface CreateOfferPayload {
  candidateId: string;

  roleTitle: string;
  salary: string;
  startDate: Date;

  reportingManager: string;
  location: string;

  offerPdf: OfferPdfBytes;
  offerFileName: string;
  offerMimeType: string;
  offerFileSize: number;

  ndaPdf: OfferPdfBytes;
  ndaFileName: string;
  ndaMimeType: string;
  ndaFileSize: number;
}

export interface UpdateOfferPayload extends CreateOfferPayload {
  id: string;
}


export interface OfferFormValues {
  candidateId: string;
  roleTitle: string;
  salary: string;
  startDate: string;
  reportingManager: string;
  location: string;
  notes: string;
}

export interface OfferPdfInput {
  candidateName: string;
  candidateEmail: string;
  roleTitle: string;
  salary: string;
  startDate: Date;
  reportingManager: string;
  location: string;
  notes?: string | null;
}

export interface OfferActionResult {
  success: boolean;
  message?: string;
}
