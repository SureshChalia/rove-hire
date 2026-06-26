import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

import LandingShell from "@/components/landing/LandingShell";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "ROVE — Modern Hiring Platform",
  description:
    "ROVE helps teams hire with clarity. Explore open roles or sign in to manage your hiring pipeline.",
};

const highlights = [
  {
    title: "Candidate-first apply flow",
    description:
      "Secure magic links, resume upload, and a polished public experience without account friction.",
    icon: Users,
  },
  {
    title: "Unified hiring pipeline",
    description:
      "Track jobs, candidates, interviews, and offers in one workspace built for HR teams.",
    icon: Workflow,
  },
  {
    title: "Thoughtful by design",
    description:
      "Clean dashboards, clear status updates, and timelines that keep everyone aligned.",
    icon: BadgeCheck,
  },
];

export default function HomePage() {
  return (
    <LandingShell>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_34%),linear-gradient(135deg,#f8fafc,#ffffff_52%,#eef6ff)]">
        <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute bottom-10 left-0 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div id="about">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" /> Hiring, reimagined
            </div>
            <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Build teams with intent.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              ROVE is a modern hiring platform for teams that care about craft,
              clarity, and candidate experience. Explore open roles or sign in
              to manage your pipeline.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-blue-600 px-6 text-base font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700"
              >
                <Link href="/careers">
                  Browse Jobs <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-xl border-slate-200 px-6 text-base font-bold hover:border-blue-200 hover:text-blue-700"
              >
                <Link href="/auth/login">HR Login</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:pt-8">
            {[
              ["Jobs", "Open roles & pipelines"],
              ["Candidates", "Profiles & resumes"],
              ["Interviews", "Scheduling & feedback"],
              ["Offers", "Letters & NDAs"],
            ].map(([value, label]) => (
              <div
                key={value}
                className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-blue-100/70"
              >
                <p className="text-2xl font-black tracking-tight text-slate-950">
                  {value}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
              </div>
            ))}
            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300 sm:col-span-2">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="h-6 w-6 text-blue-300" />
                <p className="font-bold">Ready to join ROVE?</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Browse open positions and apply in minutes with our secure
                public candidate flow.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-5 rounded-xl bg-blue-600 hover:bg-blue-500"
              >
                <Link href="/careers#open-positions">View open roles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Why ROVE
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Everything your hiring team needs.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </LandingShell>
  );
}
