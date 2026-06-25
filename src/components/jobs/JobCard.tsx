"use client";

import { BriefcaseBusiness, CalendarDays, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    deleteJobAction,
    toggleJobStatusAction,
} from "@/actions/job.actions";
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
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                            <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold">{job.title}</h2>

                            <Badge
                                variant={
                                    job.status === "Open"
                                        ? "default"
                                        : "secondary"
                                }
                                className="mt-2"
                            >
                                {job.status}
                            </Badge>
                        </div>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm text-slate-600">
                        {job.description}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                    <Badge
                        key={skill}
                        variant="outline"
                    >
                        {skill}
                    </Badge>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm text-slate-500">
                <div className="flex items-center gap-5">

                    <div className="flex items-center gap-2">
                        <Users size={16} />

                        {job.candidates.length} Candidates
                    </div>

                    <div className="flex items-center gap-2">
                        <CalendarDays size={16} />

                        {new Date(job.createdAt).toLocaleDateString()}
                    </div>

                </div>

                <div className="flex gap-2">

                    <form action={toggleJobStatusAction.bind(null, job.id)}>
                        <Button
                            size="sm"
                            variant="outline"
                        >
                            {job.status === "Open"
                                ? "Close"
                                : "Open"}
                        </Button>
                    </form>

                    <JobForm job={job} triggerLabel="Edit" />

                    <form action={deleteJobAction.bind(null, job.id)}>
                        <Button
                            size="sm"
                            variant="destructive"
                        >
                            Delete
                        </Button>
                    </form>

                </div>
            </div>
        </div>
    );
}