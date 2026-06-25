export type OfferStatus = "Sent" | "Accepted" | "Rejected";

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
  offerPdfUrl: string;
  ndaPdfUrl: string;
  createdAt: Date;
  candidateId: string;
  candidate: OfferCandidateSummary;
}

export interface CreateOfferPayload {
  candidateId: string;
  roleTitle: string;
  salary: string;
  startDate: Date;
  reportingManager: string;
  location: string;
  offerPdfUrl: string;
  ndaPdfUrl: string;
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
