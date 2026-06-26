"use client";

import { useTransition } from "react";
import { BriefcaseBusiness, CalendarDays, Trash2, Users } from "lucide-react";

import {
  deleteJobAction,
  toggleJobStatusAction,
} from "@/actions/job.actions";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JobForm from "./JobForm";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    skills: string[];
    status: "Open" | "Closed";
    createdAt: Date;
    candidates: { id: string }[];
  };
}

export default function JobCard({ job }: JobCardProps) {
  const [togglePending, startToggleTransition] = useTransition();

  const handleToggleStatus = () => {
    startToggleTransition(async () => {
      await toggleJobStatusAction(job.id);
    });
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">{job.title}</h2>

              <Badge
                variant={job.status === "Open" ? "default" : "secondary"}
                className="mt-2"
              >
                {job.status}
              </Badge>
            </div>
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
            {job.description}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <Badge key={skill} variant="outline">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <Users size={16} />
            {job.candidates.length} Candidates
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={togglePending}
            onClick={handleToggleStatus}
          >
            {togglePending
              ? "Updating..."
              : job.status === "Open"
                ? "Close"
                : "Open"}
          </Button>

          <JobForm job={job} triggerLabel="Edit" />

          <DeleteConfirmDialog
            onConfirm={() => deleteJobAction(job.id)}
            trigger={
              <Button size="sm" variant="destructive">
                <Trash2 className="mr-1 h-4 w-4" /> Delete
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
