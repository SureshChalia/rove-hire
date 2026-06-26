import Link from "next/link";
import { CalendarDays, Download, BriefcaseBusiness, Mail, Phone, MapPin, BadgeCheck, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MagicLinkActions from "./MagicLinkActions";

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
    magicToken?: string | null;
    formSubmitted?: boolean;
    createdAt: Date;
    job?: {
      title: string;
    } | null;
    interviews?: Array<{
      id: string;
      interviewer: string;
      type: string;
      status: string;
      interviewDate: Date;
    }>;
    timelines?: Array<{
      id: string;
      title: string;
      description?: string | null;
      createdAt: Date;
    }>;
  };
}

export default function CandidateDetails({ candidate }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold">{candidate.name}</h1>
              <Badge>{candidate.status}</Badge>
            </div>
            <p className="mt-2 text-slate-600">{candidate.currentRole || "Role not added"}</p>
          </div>

          {candidate.resumeUrl ? (
            <Button asChild variant="outline">
              <a href={candidate.resumeUrl} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" /> Download Resume
              </a>
            </Button>
          ) : null}
          {candidate.magicToken && !candidate.formSubmitted ? (
            <MagicLinkActions applicationPath={`/apply/${candidate.magicToken}`} />
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Mail className="h-4 w-4" /> Email
            </div>
            <p className="mt-2 font-medium">{candidate.email}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone className="h-4 w-4" /> Phone
            </div>
            <p className="mt-2 font-medium">{candidate.phone || "Not provided"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <BriefcaseBusiness className="h-4 w-4" /> Applied Job
            </div>
            <p className="mt-2 font-medium">{candidate.job?.title || "No job linked"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" /> Location
            </div>
            <p className="mt-2 font-medium">{candidate.location || "Not provided"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <BadgeCheck className="h-4 w-4" /> Notice Period
            </div>
            <p className="mt-2 font-medium">{candidate.noticePeriod || "Not provided"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <BadgeCheck className="h-4 w-4" /> Expected CTC
            </div>
            <p className="mt-2 font-medium">{candidate.salaryExpectation || "Not provided"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 md:col-span-2 xl:col-span-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FileText className="h-4 w-4" /> LinkedIn
            </div>
            <p className="mt-2 font-medium">{candidate.linkedin || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Timeline</h2>
            <Badge variant="outline">Recent Activity</Badge>
          </div>
          <div className="mt-4 space-y-4">
            {candidate.timelines?.length ? candidate.timelines.map((item) => (
              <div key={item.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.description || "No additional details"}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-slate-500">No timeline entries yet.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Interview History</h2>
            <div className="mt-4 rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
              Interview history placeholder
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Offer</h2>
            <div className="mt-4 rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
              Offer placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
