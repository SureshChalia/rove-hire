import Link from "next/link";
import { CalendarDays, Mail, Phone, BriefcaseBusiness, Eye, PencilLine, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteCandidateAction } from "@/actions/candidate.actions";
import CandidateForm from "./CandidateForm";

interface Props {
  candidate: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    linkedin?: string | null;
    currentRole?: string | null;
    location?: string | null;
    noticePeriod?: string | null;
    salaryExpectation?: string | null;
    resumeUrl?: string;
    status: string;
    createdAt: Date;
    jobId?: string;
    job?: {
      title: string;
    } | null;
  };
  jobs: Array<{
    id: string;
    title: string;
  }>;
}

export default function CandidateCard({ candidate, jobs }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{candidate.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{candidate.currentRole || "Role not added"}</p>
        </div>
        <Badge variant={candidate.status === "Hired" ? "default" : "secondary"}>
          {candidate.status}
        </Badge>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness size={16} />
          <span>{candidate.job?.title || "No job linked"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <span>{candidate.email}</span>
        </div>
        {candidate.phone && (
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span>{candidate.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {candidate.resumeUrl ? (
          <Badge variant="outline">Resume Uploaded</Badge>
        ) : (
          <Badge variant="outline">No Resume</Badge>
        )}
        {candidate.salaryExpectation ? (
          <Badge variant="outline">CTC: {candidate.salaryExpectation}</Badge>
        ) : null}
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-500">
        {candidate.noticePeriod ? (
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">Notice:</span>
            <span>{candidate.noticePeriod}</span>
          </div>
        ) : null}
        {candidate.linkedin ? (
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">LinkedIn:</span>
            <span className="truncate">{candidate.linkedin}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <CalendarDays size={16} />
        <span>{new Date(candidate.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/candidates/${candidate.id}`}>
            <Eye className="mr-1 h-4 w-4" /> View
          </Link>
        </Button>
        <CandidateForm
          candidate={{
            id: candidate.id,
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            linkedin: candidate.linkedin,
            currentRole: candidate.currentRole,
            location: candidate.location,
            noticePeriod: candidate.noticePeriod,
            salaryExpectation: candidate.salaryExpectation,
            resumeUrl: candidate.resumeUrl,
            jobId: candidate.jobId,
          }}
          jobs={jobs}
          triggerLabel="Edit"
        />
        <form action={deleteCandidateAction.bind(null, candidate.id)}>
          <Button size="sm" variant="destructive">
            <Trash2 className="mr-1 h-4 w-4" /> Delete
          </Button>
        </form>
      </div>
    </div>
  );
}
