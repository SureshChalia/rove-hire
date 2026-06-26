export type InterviewType = "Screening" | "Technical";

export type InterviewStatus = "Scheduled" | "Completed" | "Cancelled";

export type Recommendation = "Hire" | "Maybe" | "NoHire";

export interface InterviewCandidateSummary {
  id: string;
  name: string;
  email: string;
  status: string;
  job?: {
    id: string;
    title: string;
  } | null;
}

export interface InterviewRecord {
  id: string;
  interviewDate: Date;
  interviewTime?: string | null;
  duration?: string | null;
  meetingLink?: string | null;
  interviewer: string;
  type: InterviewType;
  notes?: string | null;
  status: InterviewStatus;
  recommendation?: Recommendation | null;
  feedback?: string | null;
  rating?: number | null;
  createdAt: Date;
  candidateId: string;
  candidate?: InterviewCandidateSummary | null;
}

export interface CreateInterviewPayload {
  candidateId: string;
  interviewer: string;
  type: InterviewType;
  interviewDate: Date;
  interviewTime?: string | null;
  duration?: string | null;
  meetingLink?: string | null;
  notes?: string | null;
  status?: InterviewStatus;
}

export interface UpdateInterviewPayload extends Partial<CreateInterviewPayload> {
  id: string;
}

export interface InterviewFormValues {
  candidateId: string;
  interviewer: string;
  type: InterviewType;
  interviewDate: string;
  interviewTime?: string | null;
  duration?: string | null;
  meetingLink?: string | null;  
  notes: string;
  status: InterviewStatus;
}
