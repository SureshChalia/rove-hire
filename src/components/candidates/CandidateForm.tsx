"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCandidateAction, updateCandidateAction } from "@/actions/candidate.actions";
import ResumeUpload from "./ResumeUpload";
import { CandidateFormValues } from "@/types/candidate";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  currentRole: z.string().min(2, "Current role is required"),
  location: z.string().optional(),
  noticePeriod: z.string().optional(),
  salaryExpectation: z.string().optional(),
  jobId: z.string().min(1, "Please select a job"),
});

interface Props {
  candidate?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    linkedin?: string | null;
    currentRole?: string | null;
    location?: string | null;
    noticePeriod?: string | null;
    salaryExpectation?: string | null;
    resumeUrl?: string;
    jobId?: string;
  };
  jobs: Array<{
    id: string;
    title: string;
  }>;
  triggerLabel?: string;
}

export default function CandidateForm({ candidate, jobs, triggerLabel }: Props) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(schema),
  });

  const populateForm = (currentCandidate?: Props["candidate"]) => {
    if (!currentCandidate) {
      reset({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        currentRole: "",
        location: "",
        noticePeriod: "",
        salaryExpectation: "",
        jobId: "",
      });
      setResumeFile(null);
      return;
    }

    setValue("name", currentCandidate.name);
    setValue("email", currentCandidate.email);
    setValue("phone", currentCandidate.phone || "");
    setValue("linkedin", currentCandidate.linkedin || "");
    setValue("currentRole", currentCandidate.currentRole || "");
    setValue("location", currentCandidate.location || "");
    setValue("noticePeriod", currentCandidate.noticePeriod || "");
    setValue("salaryExpectation", currentCandidate.salaryExpectation || "");
    setValue("jobId", currentCandidate.jobId || "");
  };

  useEffect(() => {
    populateForm(candidate);
  }, [candidate, reset, setValue]);

  async function onSubmit(data: CandidateFormValues) {
    const formData = new FormData();

    if (candidate) {
      formData.append("id", candidate.id);
      formData.append("existingResumeUrl", candidate.resumeUrl || "");
    }

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone || "");
    formData.append("linkedin", data.linkedin || "");
    formData.append("currentRole", data.currentRole);
    formData.append("location", data.location || "");
    formData.append("noticePeriod", data.noticePeriod || "");
    formData.append("salaryExpectation", data.salaryExpectation || "");
    formData.append("jobId", data.jobId);

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    startTransition(async () => {
      if (candidate) {
        await updateCandidateAction(formData);
      } else {
        await createCandidateAction(formData);
      }

      reset({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        currentRole: "",
        location: "",
        noticePeriod: "",
        salaryExpectation: "",
        jobId: "",
      });
      setResumeFile(null);
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          populateForm(candidate);
          return;
        }

        reset({
          name: "",
          email: "",
          phone: "",
          linkedin: "",
          currentRole: "",
          location: "",
          noticePeriod: "",
          salaryExpectation: "",
          jobId: "",
        });
        setResumeFile(null);
      }}
    >
      <DialogTrigger asChild>
        {candidate ? (
          <Button size="sm" variant="outline">
            {triggerLabel || "Edit"}
          </Button>
        ) : (
          <Button size="lg">+ Add Candidate</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[96vw] max-w-5xl overflow-hidden p-0 sm:w-[92vw]">
        <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl sm:text-2xl">
              {candidate ? "Edit Candidate" : "Add Candidate"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="Aisha Khan" {...register("name")} />
              <p className="mt-1 text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="aisha@example.com" {...register("email")} />
              <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input placeholder="+91 98765 43210" {...register("phone")} />
            </div>

            <div>
              <label className="text-sm font-medium">LinkedIn</label>
              <Input placeholder="https://linkedin.com/in/" {...register("linkedin")} />
            </div>

            <div>
              <label className="text-sm font-medium">Current Role</label>
              <Input placeholder="Frontend Engineer" {...register("currentRole")} />
              <p className="mt-1 text-sm text-red-500">{errors.currentRole?.message}</p>
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="Bengaluru, India" {...register("location")} />
            </div>

            <div>
              <label className="text-sm font-medium">Notice Period</label>
              <Input placeholder="30 days" {...register("noticePeriod")} />
            </div>

            <div>
              <label className="text-sm font-medium">Salary Expectation</label>
              <Input placeholder="₹18-22 LPA" {...register("salaryExpectation")} />
            </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Applied Job</label>
                <select
                  className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                  {...register("jobId")}
                >
                  <option value="">Select a job</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-red-500">{errors.jobId?.message}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Resume</label>
              <ResumeUpload
                value={candidate?.resumeUrl || ""}
                onFileChange={setResumeFile}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea rows={4} placeholder="Add any relevant interview notes..." />
            </div>

            <DialogFooter className="flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={pending} className="w-full sm:w-auto">
                {pending ? (candidate ? "Saving..." : "Creating...") : candidate ? "Save Changes" : "Create Candidate"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
