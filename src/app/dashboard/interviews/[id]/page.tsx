import { notFound } from "next/navigation";
import { InterviewDetails } from "@/components/interviews";
import { getInterviewById } from "@/services/interview.service";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InterviewDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const interview = await getInterviewById(resolvedParams.id);

  if (!interview) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <a href="/dashboard/interviews" className="text-sm font-medium text-blue-600">
          ← Back to interviews
        </a>
      </div>

      <InterviewDetails
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
          recommendation: interview.recommendation,
          feedback: interview.feedback,
          rating: interview.rating,
          candidate: interview.candidate,
        }}
      />
    </div>
  );
}
