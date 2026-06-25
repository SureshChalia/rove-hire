export interface CreateJobPayload {
  title: string;
  description: string;
  skills: string[];
  location?: string;
  department?: string;
  employmentType?: string;
  experience?: string;
  salary?: string;
}

export interface UpdateJobPayload extends CreateJobPayload {
  id: string;
}