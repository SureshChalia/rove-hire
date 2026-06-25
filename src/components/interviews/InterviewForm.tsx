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
import { createInterviewAction, updateInterviewAction } from "@/actions/interview.actions";
import { InterviewFormValues } from "@/types/interview";

const schema = z.object({
  candidateId: z.string().min(1, "Select a candidate"),
  interviewer: z.string().min(2, "Interviewer is required"),
  type: z.enum(["Screening", "Technical"]),
  interviewDate: z.string().min(1, "Date is required"),
  interviewTime: z.string().min(1, "Time is required"),
  duration: z.string().min(1, "Duration is required"),
  meetingLink: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["Scheduled", "Completed", "Cancelled"]),
});

type FormData = z.infer<typeof schema>;

interface Props {
  interview?: {
    id: string;
    interviewDate: Date;
    interviewTime: string;
    duration: string;
    meetingLink?: string | null;
    interviewer: string;
    type: "Screening" | "Technical";
    notes?: string | null;
    status: "Scheduled" | "Completed" | "Cancelled";
    candidateId: string;
  };
  candidates: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    job?: {
      title: string;
    } | null;
  }>;
  triggerLabel?: string;
}

export default function InterviewForm({ interview, candidates, triggerLabel }: Props) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      candidateId: "",
      interviewer: "",
      type: "Screening",
      interviewDate: "",
      interviewTime: "",
      duration: "45 min",
      meetingLink: "",
      notes: "",
      status: "Scheduled",
    },
  });

  const populateForm = (currentInterview?: Props["interview"]) => {
    if (!currentInterview) {
      reset({
        candidateId: "",
        interviewer: "",
        type: "Screening",
        interviewDate: "",
        interviewTime: "",
        duration: "45 min",
        meetingLink: "",
        notes: "",
        status: "Scheduled",
      });
      return;
    }

    setValue("candidateId", currentInterview.candidateId);
    setValue("interviewer", currentInterview.interviewer);
    setValue("type", currentInterview.type);
    setValue("interviewDate", new Date(currentInterview.interviewDate).toISOString().split("T")[0]);
    setValue("interviewTime", currentInterview.interviewTime);
    setValue("duration", currentInterview.duration);
    setValue("meetingLink", currentInterview.meetingLink || "");
    setValue("notes", currentInterview.notes || "");
    setValue("status", currentInterview.status);
  };

  useEffect(() => {
    populateForm(interview);
  }, [interview, reset, setValue]);

  async function onSubmit(data: FormData) {
    const formData = new FormData();

    if (interview) {
      formData.append("id", interview.id);
    }

    formData.append("candidateId", data.candidateId);
    formData.append("interviewer", data.interviewer);
    formData.append("type", data.type);
    formData.append("interviewDate", data.interviewDate);
    formData.append("interviewTime", data.interviewTime);
    formData.append("duration", data.duration);
    formData.append("meetingLink", data.meetingLink || "");
    formData.append("notes", data.notes || "");
    formData.append("status", data.status);

    startTransition(async () => {
      if (interview) {
        await updateInterviewAction(formData);
      } else {
        await createInterviewAction(formData);
      }

      reset({
        candidateId: "",
        interviewer: "",
        type: "Screening",
        interviewDate: "",
        interviewTime: "",
        duration: "45 min",
        meetingLink: "",
        notes: "",
        status: "Scheduled",
      });
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          populateForm(interview);
          return;
        }

        reset({
          candidateId: "",
          interviewer: "",
          type: "Screening",
          interviewDate: "",
          interviewTime: "",
          duration: "45 min",
          meetingLink: "",
          notes: "",
          status: "Scheduled",
        });
      }}
    >
      <DialogTrigger asChild>
        {interview ? (
          <Button size="sm" variant="outline">
            {triggerLabel || "Edit"}
          </Button>
        ) : (
          <Button size="lg">+ Schedule Interview</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[96vw] max-w-4xl overflow-hidden p-0 sm:w-[92vw]">
        <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl sm:text-2xl">
              {interview ? "Edit Interview" : "Schedule Interview"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Candidate</label>
                <select
                  className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                  {...register("candidateId")}
                >
                  <option value="">Select a candidate</option>
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name} — {candidate.job?.title || "No job"}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-red-500">{errors.candidateId?.message}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Interview Type</label>
                <select
                  className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                  {...register("type")}
                >
                  <option value="Screening">Screening</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Interviewer Name</label>
                <Input placeholder="Jane Doe" {...register("interviewer")} />
                <p className="mt-1 text-sm text-red-500">{errors.interviewer?.message}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Date</label>
                <Input type="date" {...register("interviewDate")} />
                <p className="mt-1 text-sm text-red-500">{errors.interviewDate?.message}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Time</label>
                <Input type="time" {...register("interviewTime")} />
                <p className="mt-1 text-sm text-red-500">{errors.interviewTime?.message}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Duration</label>
                <Input placeholder="45 min" {...register("duration")} />
                <p className="mt-1 text-sm text-red-500">{errors.duration?.message}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Meeting Link</label>
                <Input placeholder="https://meet.google.com/abc-defg-hij" {...register("meetingLink")} />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea rows={4} placeholder="Add interview notes" {...register("notes")} />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                  {...register("status")}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : interview ? "Update Interview" : "Schedule Interview"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
