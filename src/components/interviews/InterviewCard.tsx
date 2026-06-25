"use client";

import Link from "next/link";
import { useTransition } from "react";
import { CalendarDays, Clock3, Eye, Trash2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteInterviewAction, changeInterviewStatusAction } from "@/actions/interview.actions";
import InterviewForm from "./InterviewForm";

interface Props {
  interview: {
    id: string;
    interviewDate: Date;
    interviewTime: string;
    duration: string;
    meetingLink?: string | null;
    interviewer: string;
    type: "Screening" | "Technical";
    notes?: string | null;
    status: "Scheduled" | "Completed" | "Cancelled";
    recommendation?: "Hire" | "Maybe" | "Reject" | null;
    feedback?: string | null;
    candidateId: string;
    candidate?: {
      id: string;
      name: string;
      status: string;
      job?: {
        title: string;
      } | null;
    } | null;
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
}

export default function InterviewCard({ interview, candidates }: Props) {
  const [pending, startTransition] = useTransition();

  const handleComplete = () => {
    startTransition(async () => {
      await changeInterviewStatusAction(interview.id, "Completed");
    });
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{interview.candidate?.name || "Candidate"}</h3>
          <p className="mt-1 text-sm text-slate-600">{interview.candidate?.job?.title || "No job linked"}</p>
        </div>
        <Badge variant={interview.status === "Completed" ? "default" : interview.status === "Cancelled" ? "destructive" : "secondary"}>
          {interview.status}
        </Badge>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">Type:</span>
          <span>{interview.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">Interviewer:</span>
          <span>{interview.interviewer}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          <span>{new Date(interview.interviewDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 size={16} />
          <span>{interview.interviewTime} • {interview.duration}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline">{interview.type}</Badge>
        {interview.recommendation ? <Badge variant="outline">{interview.recommendation}</Badge> : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/interviews/${interview.id}`}>
            <Eye className="mr-1 h-4 w-4" /> View
          </Link>
        </Button>
        <InterviewForm
          interview={{
            id: interview.id,
            interviewDate: interview.interviewDate,
            interviewTime: interview.interviewTime,
            duration: interview.duration,
            meetingLink: interview.meetingLink,
            interviewer: interview.interviewer,
            type: interview.type,
            notes: interview.notes,
            status: interview.status,
            candidateId: interview.candidateId,
          }}
          candidates={candidates}
          triggerLabel="Edit"
        />
        <form action={deleteInterviewAction.bind(null, interview.id)}>
          <Button size="sm" variant="destructive">
            <Trash2 className="mr-1 h-4 w-4" /> Delete
          </Button>
        </form>
        {interview.status !== "Completed" && (
          <Button size="sm" variant="secondary" onClick={handleComplete} disabled={pending}>
            <CheckCircle2 className="mr-1 h-4 w-4" /> Complete
          </Button>
        )}
      </div>
    </div>
  );
}
