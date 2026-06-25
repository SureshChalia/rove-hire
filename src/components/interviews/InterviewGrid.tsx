import InterviewCard from "./InterviewCard";

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
      <div className="rounded-2xl border border-dashed bg-slate-50 p-10 text-center text-slate-500">
        No interviews scheduled yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {interviews.map((interview) => (
        <InterviewCard key={interview.id} interview={interview} candidates={candidates} />
      ))}
    </div>
  );
}
