import {
  BadgeCheck,
  Blocks,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import CareersShell from "@/components/careers/CareersShell";
import JobExplorer from "@/components/careers/JobExplorer";
import {getOpenJobs} from "@/services/job.service"

const benefits = [
  {
    title: "Meaningful ownership",
    description: "Small teams, real autonomy, and clear room to shape products.",
    icon: Rocket,
  },
  {
    title: "Healthy collaboration",
    description: "Work with sharp, kind people who value high craft and low ego.",
    icon: HeartHandshake,
  },
  {
    title: "Flexible work",
    description: "Hybrid-friendly rituals designed around focus and momentum.",
    icon: Blocks,
  },
  {
    title: "Growth support",
    description: "Learning budgets, mentorship, and honest feedback loops.",
    icon: BadgeCheck,
  },
];

export const metadata = {
  title: "Careers at ROVE",
  description: "Join ROVE and build thoughtful technology with ambitious teams.",
};

export default async function CareersPage() {
  const jobs = await getOpenJobs();

  return (
    <CareersShell>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_34%),linear-gradient(135deg,#f8fafc,#ffffff_52%,#eef6ff)]">
        <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute bottom-10 left-0 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div id="about">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" /> We are hiring now
            </div>
            <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Join ROVE
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              ROVE is building modern hiring and workflow technology for teams
              that move with intent. We care about polished products, human
              systems, and people who bring curiosity to hard problems.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#open-positions"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Explore open positions
              </a>
              <a
                href="#benefits"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                See benefits
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:pt-8">
            {[
              ["12+", "Product teams"],
              ["4.8/5", "Candidate care"],
              ["14 days", "Secure apply links"],
              ["100%", "Open roles shown"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur transition hover:-translate-y-1"
              >
                <p className="text-4xl font-black tracking-tight text-slate-950">
                  {value}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
              </div>
            ))}
            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300 sm:col-span-2">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-300" />
                <p className="font-bold">Candidate-first hiring</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Our public application flow is quick, secure, and designed to
                keep candidates informed without requiring an account.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Featured benefits
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Work that respects ambition and energy.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="open-positions" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Open positions
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                Find your next role.
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <ShieldCheck className="h-4 w-4" /> Only open jobs are listed
            </div>
          </div>

          <div className="mt-10">
            <JobExplorer jobs={jobs} />
          </div>
        </div>
      </section>
    </CareersShell>
  );
}
