import { BriefcaseBusiness } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import JobForm from "./JobForm";

export default function EmptyJobs() {
  return (
    <EmptyState
      icon={BriefcaseBusiness}
      title="No jobs created yet"
      description="Create your first job opening to start managing candidates, interviews, and offers."
      action={<JobForm />}
    />
  );
}
