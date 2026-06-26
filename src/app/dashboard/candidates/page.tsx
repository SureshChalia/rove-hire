import { Suspense } from "react";
import { Users } from "lucide-react";

import { CandidateForm, CandidateGrid } from "@/components/candidates";
import EmptyState from "@/components/shared/EmptyState";
import { getCandidates } from "@/services/candidate.service";
import { getJobs } from "@/services/job.service";
import { Button } from "@/components/ui/button";

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search?.trim();
  const [candidates, jobs] = await Promise.all([getCandidates(search), getJobs()]);

  const jobOptions = jobs.map((job) => ({ id: job.id, title: job.title }));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">Candidates</h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">Track applicants, resumes, and pipeline activity.</p>
        </div>

        <div className="flex-shrink-0">
          <CandidateForm jobs={jobOptions} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-slate-500">
            {candidates.length} candidate{candidates.length === 1 ? "" : "s"} found
          </div>
          <form method="GET" className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              name="search"
              defaultValue={search || ""}
              placeholder="Search by name or role"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none sm:w-72"
            />
            <Button type="submit" variant="outline" className="w-full sm:w-auto">Search</Button>
          </form>
        </div>
      </div>

      {candidates.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates yet"
          description="Add your first candidate to start managing applicants, resumes, and pipeline activity."
          action={<CandidateForm jobs={jobOptions} />}
        />
      ) : (
        <Suspense fallback={<div className="text-sm text-slate-500">Loading candidates...</div>}>
          <CandidateGrid
            candidates={candidates.map((candidate) => ({
              id: candidate.id,
              name: candidate.name,
              email: candidate.email,
              phone: candidate.phone,
              linkedin: candidate.linkedin,
              currentRole: candidate.currentRole,
              location: candidate.location,
              noticePeriod: candidate.noticePeriod,
              salaryExpectation: candidate.salaryExpectation,
              jobId: candidate.jobId,
              resumeUrl: candidate.resumeUrl,
              status: candidate.status,
              magicToken: candidate.magicToken,
              formSubmitted: candidate.formSubmitted,
              createdAt: candidate.createdAt,
              job: candidate.job,
            }))}
            jobs={jobOptions}
          />
        </Suspense>
      )}
    </div>
  );
}