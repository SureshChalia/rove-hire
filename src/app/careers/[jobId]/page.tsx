import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeIndianRupee,
  BriefcaseBusiness,
  Clock3,
  Layers3,
  MapPin,
  Sparkles,
} from "lucide-react";

import ApplyStartForm from "@/components/careers/ApplyStartForm";
import CareersShell from "@/components/careers/CareersShell";
import { Badge } from "@/components/ui/badge";
import { getOpenJobById } from "@/services/job.service";

export default async function JobDetailsPage({
  params,
}: PageProps<"/careers/[jobId]">) {
  const { jobId } = await params;
  const job = await getOpenJobById(jobId);

  if (!job) {
    notFound();
  }

  const details = [
    { label: "Department", value: job.department || "ROVE", icon: Layers3 },
    { label: "Location", value: job.location || "Flexible", icon: MapPin },
    { label: "Employment Type", value: job.employmentType || "Full time", icon: Clock3 },
    { label: "Experience", value: job.experience || "Role dependent", icon: BriefcaseBusiness },
    { label: "Salary", value: job.salary || "Competitive", icon: BadgeIndianRupee },
  ];

  return (
    <CareersShell>
      <section className="bg-[radial-gradient(circle_at_top_right,_#dbeafe,_transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Link
            href="/careers#open-positions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to careers
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <Sparkles className="h-4 w-4" /> Open role
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                {job.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {job.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {details.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <div
                      key={detail.label}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Icon className="h-4 w-4 text-blue-600" />
                        {detail.label}
                      </div>
                      <p className="mt-2 font-bold text-slate-900">
                        {detail.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:sticky lg:top-28">
              <ApplyStartForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.7fr_0.3fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black tracking-tight">About the role</h2>
            <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
              {job.description}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-2xl font-black tracking-tight">Skills</h2>
            {job.skills.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="h-7 px-3">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">
                Skills will be discussed during screening.
              </p>
            )}
            <a
              href="#apply"
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Apply Now
            </a>
          </div>
        </div>
      </section>
    </CareersShell>
  );
}
