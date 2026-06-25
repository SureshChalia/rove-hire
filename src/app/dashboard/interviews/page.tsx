import { getCandidates } from "@/services/candidate.service";
import { getInterviews } from "@/services/interview.service";
import { InterviewForm, InterviewGrid } from "@/components/interviews";

export default async function InterviewsPage() {
  const [interviews, candidates] = await Promise.all([
    getInterviews(),
    getCandidates(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="mt-2 text-sm text-slate-500">
            Schedule, track, and complete candidate interviews.
          </p>
        </div>
        <InterviewForm
          candidates={candidates.map((candidate) => ({
            id: candidate.id,
            name: candidate.name,
            email: candidate.email,
            status: candidate.status,
            job: candidate.job,
          }))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Interviews</p>
          <p className="mt-2 text-2xl font-semibold">{interviews.length}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Upcoming</p>
          <p className="mt-2 text-2xl font-semibold">
            {interviews.filter((item) => item.status === "Scheduled").length}
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-2 text-2xl font-semibold">
            {interviews.filter((item) => item.status === "Completed").length}
          </p>
        </div>
      </div>

      <InterviewGrid
        interviews={interviews as any}
        candidates={candidates.map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          status: candidate.status,
          job: candidate.job,
        }))}
      />
    </div>
  );
}