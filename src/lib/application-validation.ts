import { z } from "zod";

export const startApplicationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  jobId: z.string().trim().min(1, "Select a job."),
});

export const applicationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  location: z.string().trim().min(2, "Enter your current location."),
  currentRole: z.string().trim().min(2, "Enter your current role."),
  noticePeriod: z.string().trim().min(1, "Enter your notice period."),
  salaryExpectation: z.string().trim().min(1, "Enter your salary expectation."),
  linkedin: z
    .string()
    .trim()
    .url("Enter a valid LinkedIn URL.")
    .refine((value) => value.includes("linkedin.com"), "Enter a LinkedIn URL."),
});

export type StartApplicationValues = z.infer<typeof startApplicationSchema>;
export type ApplicationValues = z.infer<typeof applicationSchema>;
