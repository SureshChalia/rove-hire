import {
  EmptyJobs,
  JobForm,
  JobGrid,
} from "@/components/jobs";

import { getJobs } from "@/services/job.service";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Jobs
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all job openings.
          </p>

        </div>

        <JobForm />

      </div>

      {jobs.length === 0 ? (
        <EmptyJobs />
      ) : (
        <JobGrid jobs={jobs} />
      )}

    </div>
  );
}