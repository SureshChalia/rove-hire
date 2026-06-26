"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send } from "lucide-react";

import { submitApplicationAction } from "@/actions/candidate.actions";
import {
  applicationSchema,
  type ApplicationValues,
} from "@/lib/application-validation";
import ResumeUpload from "@/components/candidates/ResumeUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  token: string;
  candidate: {
    name: string;
    email: string;
    phone?: string | null;
    location?: string | null;
    currentRole?: string | null;
    noticePeriod?: string | null;
    salaryExpectation?: string | null;
    linkedin?: string | null;
  };
}

export default function ApplicationForm({ token, candidate }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [actionError, setActionError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone || "",
      location: candidate.location || "",
      currentRole: candidate.currentRole || "",
      noticePeriod: candidate.noticePeriod || "",
      salaryExpectation: candidate.salaryExpectation || "",
      linkedin: candidate.linkedin || "",
    },
  });

  function onSubmit(values: ApplicationValues) {
    if (!resumeFile) {
      setActionError("Upload your resume as a PDF.");
      return;
    }

    setActionError("");
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("resume", resumeFile);

    startTransition(async () => {
      const result = await submitApplicationAction(token, formData);

      if (!result.success || !result.successPath) {
        setActionError(result.message || "Unable to submit your application.");
        return;
      }

      router.push(result.successPath);
    });
  }

  const fields: Array<{
    name: keyof ApplicationValues;
    label: string;
    placeholder: string;
    type?: string;
    autoComplete?: string;
  }> = [
    { name: "name", label: "Full name", placeholder: "Your full name", autoComplete: "name" },
    { name: "email", label: "Email", placeholder: "you@example.com", type: "email", autoComplete: "email" },
    { name: "phone", label: "Phone", placeholder: "+91 98765 43210", type: "tel", autoComplete: "tel" },
    { name: "location", label: "Current location", placeholder: "Chandigarh, India", autoComplete: "address-level2" },
    { name: "currentRole", label: "Current role", placeholder: "Frontend Engineer", autoComplete: "organization-title" },
    { name: "noticePeriod", label: "Notice period", placeholder: "30 days" },
    { name: "salaryExpectation", label: "Salary expectation", placeholder: "INR 18-22 LPA" },
    { name: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/your-name", type: "url", autoComplete: "url" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              className="h-11"
              aria-invalid={Boolean(errors[field.name])}
              {...register(field.name)}
            />
            {errors[field.name] && (
              <p className="text-sm text-red-600">
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div>
        <Label>Resume (PDF)</Label>
        <ResumeUpload onFileChange={setResumeFile} />
      </div>

      {actionError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {actionError}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-5 text-slate-500">
          By submitting, you confirm that the information provided is accurate.
          This link can only be used once.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-12 rounded-xl bg-blue-600 px-6 text-base hover:bg-blue-700"
        >
          {pending ? (
            <>
              <LoaderCircle className="animate-spin" /> Submitting
            </>
          ) : (
            <>
              Submit application <Send />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
