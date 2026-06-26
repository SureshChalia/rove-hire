import { CalendarClock } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import InterviewCard from "./InterviewCard";
import InterviewForm from "./InterviewForm";

interface Props {
  interviews: Array<{
    id: string;
    interviewDate: Date;
    interviewTime: string;
    duration: string;
    meetingLink?: string | null;
    interviewer: string;
    type: "Screening" | "Technical";
    notes?: string | null;
    status: "Scheduled" | "Completed" | "Cancelled";
    recommendation?: "Hire" | "Maybe" |  "NoHire" | null;
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
  }>;
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

export default function InterviewGrid({ interviews, candidates }: Props) {
  if (!interviews.length) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="No interviews scheduled yet"
        description="Schedule your first interview to move candidates through the hiring pipeline."
        action={<InterviewForm candidates={candidates} />}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {interviews.map((interview) => (
        <InterviewCard
          key={interview.id}
          interview={interview}
          candidates={candidates}
        />
      ))}
    </div>
  );
}
