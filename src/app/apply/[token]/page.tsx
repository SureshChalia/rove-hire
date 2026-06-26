import Link from "next/link";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";

import ApplicationForm from "@/components/careers/ApplicationForm";
import CareersShell from "@/components/careers/CareersShell";
import { Badge } from "@/components/ui/badge";
import { getCandidateApplicationByToken } from "@/services/candidate.service";

function StateCard({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: "invalid" | "expired" | "closed" | "submitted";
}) {
  const toneStyles = {
    invalid: "bg-red-50 text-red-600",
    expired: "bg-amber-50 text-amber-600",
    closed: "bg-slate-100 text-slate-600",
    submitted: "bg-emerald-50 text-emerald-600",
  } as const;
  const Icon =
    tone === "submitted"
      ? CheckCircle2
      : tone === "closed"
        ? BriefcaseBusiness
        : AlertTriangle;

  return (
    <CareersShell>
      <section className="min-h-[70vh] bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-200">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${toneStyles[tone]}`}
          >
            <Icon className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight">{title}</h1>
          <p className="mt-3 leading-7 text-slate-600">{description}</p>
          <Link
            href="/careers"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
          >
            Return to Careers
          </Link>
        </div>
      </section>
    </CareersShell>
  );
}

export default async function ApplyPage({ params }: PageProps<"/apply/[token]">) {
  const { token } = await params;
  const candidate = await getCandidateApplicationByToken(token);

  if (!candidate) {
    return (
      <StateCard
        tone="invalid"
        title="Invalid Link"
        description="This application link is not valid. Please return to careers and start a fresh application for an open role."
      />
    );
  }

  if (!candidate.tokenExpiry || candidate.tokenExpiry < new Date()) {
    return (
      <StateCard
        tone="expired"
        title="Link Expired"
        description="This application link is no longer valid. Please return to careers and start a fresh application for an open role."
      />
    );
  }

  if (candidate.formSubmitted) {
    return (
      <StateCard
        tone="submitted"
        title="Already Submitted"
        description="We already received this application. Our team will review it and follow up with the next steps."
      />
    );
  }

  if (candidate.job.status !== "Open") {
    return (
      <StateCard
        tone="closed"
        title="Position Closed"
        description="This role is no longer accepting applications. Browse open positions on the careers page."
      />
    );
  }

  return (
    <CareersShell>
      <section className="bg-[radial-gradient(circle_at_top_right,_#dbeafe,_transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff)] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
            <Badge variant="secondary">Secure application</Badge>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Complete your application
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Share your details and resume for the selected role. This link is
              valid until{" "}
              <span className="font-semibold text-slate-800">
                {candidate.tokenExpiry.toLocaleDateString()}
              </span>
              .
            </p>

            <div className="mt-8 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <BriefcaseBusiness className="h-4 w-4" /> Selected role
                </div>
                <h2 className="mt-2 text-2xl font-bold">{candidate.job.title}</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4" />
                {candidate.job.location || "Flexible"}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock3 className="h-4 w-4" />
                {candidate.job.employmentType || "Full time"}
              </div>
              <div className="text-sm text-slate-600">
                {candidate.job.department || "ROVE"}
              </div>
            </div>

            <div className="mt-8">
              <ApplicationForm
                token={token}
                candidate={{
                  name: candidate.name,
                  email: candidate.email,
                  phone: candidate.phone,
                  location: candidate.location,
                  currentRole: candidate.currentRole,
                  noticePeriod: candidate.noticePeriod,
                  salaryExpectation: candidate.salaryExpectation,
                  linkedin: candidate.linkedin,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </CareersShell>
  );
}
