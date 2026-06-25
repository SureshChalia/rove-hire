import { BriefcaseBusiness } from "lucide-react";
import JobForm from "./JobForm";

export default function EmptyJobs() {
  return (
    <div className="mt-10 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
        <BriefcaseBusiness className="h-8 w-8 text-blue-600" />
      </div>

      <h3 className="mt-6 text-2xl font-semibold">
        No jobs created yet
      </h3>

      <p className="mx-auto mt-3 max-w-md text-slate-500">
        Create your first job opening to start managing candidates and interviews.
      </p>

      <div className="mt-8 flex justify-center">
        <JobForm />
      </div>
    </div>
  );
}