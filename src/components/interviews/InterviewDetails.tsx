"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ExternalLink, MessageSquareQuote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { completeInterviewAction } from "@/actions/interview.actions";
import type { Recommendation } from "@/types/interview";

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
    recommendation?: Recommendation | null | undefined;
    feedback?: string | null;
    rating?: number | null;
    candidate?: {
      id: string;
      name: string;
      email: string;
      status: string;
      job?: {
        title: string;
      } | null;
    } | null;
  };
}

export default function InterviewDetails({ interview }: Props) {
  const [pending, startTransition] = useTransition();
  const [recommendation, setRecommendation] = useState<Recommendation>("Hire");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);

  const handleComplete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      await completeInterviewAction(interview.id, recommendation, feedback, rating);
    });
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {interview.candidate?.name || "Candidate"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {interview.candidate?.job?.title || "No job linked"}
          </p>
        </div>
        <Badge variant={interview.status === "Completed" ? "default" : interview.status === "Cancelled" ? "destructive" : "secondary"}>
          {interview.status}
        </Badge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Interview Type</div>
          <p className="mt-2 font-medium">{interview.type}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Interviewer</div>
          <p className="mt-2 font-medium">{interview.interviewer}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Date & Time</div>
          <p className="mt-2 font-medium">{new Date(interview.interviewDate).toLocaleDateString()} at {interview.interviewTime}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Duration</div>
          <p className="mt-2 font-medium">{interview.duration}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MessageSquareQuote className="h-4 w-4" /> Notes
        </div>
        <p className="mt-2 text-sm text-slate-700">{interview.notes || "No notes added yet."}</p>
      </div>

      {interview.meetingLink ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <ExternalLink className="h-4 w-4" />
          <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="font-medium underline">
            Open meeting link
          </a>
        </div>
      ) : null}

      {interview.status !== "Completed" ? (
        <div className="mt-6 rounded-xl border border-dashed p-4">
          <h3 className="text-lg font-semibold">Complete Interview</h3>
          <p className="mt-2 text-sm text-slate-600">Add feedback and recommendation to finalize this interview.</p>
          <form onSubmit={handleComplete} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Recommendation</label>
                <select
                  className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                  value={recommendation}
                  onChange={(event) => setRecommendation(event.target.value as Recommendation)}
                >
                  <option value="Hire">Hire</option>
                  <option value="Maybe">Maybe</option>
                  <option value= "NoHire">Reject</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Feedback</label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                placeholder="Share the interviewer notes"
              />
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting..." : "Mark as Completed"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Star className="h-4 w-4" /> Feedback
          </div>
          <p className="mt-2 text-sm text-slate-700">{interview.feedback || "No feedback recorded."}</p>
          <p className="mt-2 text-sm text-slate-700">Rating: {interview.rating ?? "N/A"}</p>
          <p className="mt-2 text-sm text-slate-700">Recommendation: {interview.recommendation || "N/A"}</p>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <Button asChild variant="outline">
          <Link href="/dashboard/interviews">← Back to interviews</Link>
        </Button>
      </div>
    </div>
  );
}
