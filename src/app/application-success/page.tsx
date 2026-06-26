import Link from "next/link";
import { CheckCircle2, ClipboardCheck, MailCheck, Sparkles } from "lucide-react";

import CareersShell from "@/components/careers/CareersShell";

export default async function ApplicationSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ reference?: string }>;
}) {
  const resolvedParams = await searchParams;
  const reference = resolvedParams?.reference
    ? `ROVE-${resolvedParams.reference.slice(0, 8).toUpperCase()}`
    : "ROVE-APPLICATION";

  return (
    <CareersShell>
      <section className="min-h-[72vh] bg-[radial-gradient(circle_at_top,_#dbeafe,_transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff)] px-5 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl shadow-slate-200 sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <Sparkles className="h-4 w-4" /> Thank you for applying
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Application Submitted Successfully
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Your application is now with the ROVE hiring team. We will review
            your profile and reach out if there is a match for the role.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">
              Application reference
            </p>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              {reference}
            </p>
          </div>

          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
              <h2 className="mt-4 font-bold">Review</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Our HR team reviews your resume and application details.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <MailCheck className="h-6 w-6 text-blue-600" />
              <h2 className="mt-4 font-bold">Next steps</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                If shortlisted, we will contact you for screening and interviews.
              </p>
            </div>
          </div>

          <Link
            href="/careers"
            className="mt-9 inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700"
          >
            Return to Careers
          </Link>
        </div>
      </section>
    </CareersShell>
  );
}
