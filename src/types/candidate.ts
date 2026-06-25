export type CandidateStatus =
  | "Applied"
  | "FormSubmitted"
  | "InterviewScheduled"
  | "OfferSent"
  | "Hired"
  | "Rejected";

export interface CandidateJobSummary {
  id: string;
  title: string;
}

export interface CandidateInterviewSummary {
  id: string;
  interviewDate: Date;
  interviewer: string;
  status: string;
  type: string;
}

export interface CandidateTimelineItem {
  id: string;
  title: string;
  description?: string | null;
  createdAt: Date;
}

export interface CandidateRecord {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  linkedin?: string | null;
  currentRole?: string | null;
  location?: string | null;
  noticePeriod?: string | null;
  salaryExpectation?: string | null;
  resumeUrl: string;
  status: CandidateStatus;
  createdAt: Date;
  updatedAt: Date;
  jobId: string;
  job?: CandidateJobSummary | null;
}

export interface CandidateWithRelations extends CandidateRecord {
  interviews?: CandidateInterviewSummary[];
  timelines?: CandidateTimelineItem[];
}

export interface CreateCandidatePayload {
  name: string;
  email: string;
  phone?: string | null;
  linkedin?: string | null;
  currentRole?: string | null;
  location?: string | null;
  noticePeriod?: string | null;
  salaryExpectation?: string | null;
  resumeUrl?: string;
  status?: CandidateStatus;
  jobId: string;
}

export interface UpdateCandidatePayload extends Partial<CreateCandidatePayload> {
  id: string;
}

export interface CandidateFormValues {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  currentRole: string;
  location: string;
  noticePeriod: string;
  salaryExpectation: string;
  jobId: string;
}
