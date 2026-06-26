"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Search,
} from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  department?: string | null;
  location?: string | null;
  employmentType?: string | null;
  experience?: string | null;
}

export default function JobExplorer({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const departments = useMemo(
    () =>
      Array.from(
        new Set(jobs.map((job) => job.department).filter(Boolean) as string[])
      ).sort(),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesDepartment =
        department === "All" || job.department === department;
      const matchesSearch =
        !query ||
        [
          job.title,
          job.description,
          job.department,
          job.location,
          ...job.skills,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query));

      return matchesDepartment && matchesSearch;
    });
  }, [department, jobs, search]);

  return (
    <div>
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/40 sm:grid-cols-[1fr_220px]">
        <label className="relative">
          <span className="sr-only">Search jobs</span>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, skill, or location"
            className="h-12 border-0 bg-slate-50 pl-12 shadow-none focus-visible:ring-blue-500/20"
          />
        </label>
        <label>
          <span className="sr-only">Filter by department</span>
          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="h-12 w-full rounded-lg border-0 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-3 focus:ring-blue-500/20"
          >
            <option value="All">All departments</option>
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">
          {filteredJobs.length} open position
          {filteredJobs.length === 1 ? "" : "s"}
        </p>
        {(search || department !== "All") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDepartment("All");
            }}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredJobs.length ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              href={`/careers/${job.id}`}
              className="group rounded-3xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600" />
              </div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                {job.department || "ROVE"}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                {job.title}
              </h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                {job.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location || "Flexible"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" />
                  {job.employmentType || "Full time"}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
          icon={BriefcaseBusiness}
          title={jobs.length ? "No matching roles" : "No open positions right now"}
          description={
            jobs.length
              ? "Try a different keyword or department to find a role that fits."
              : "Check back soon for new opportunities, or reach out to our team directly."
          }
          action={
            jobs.length ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setSearch("");
                  setDepartment("All");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/">Back to home</Link>
              </Button>
            )
          }
        />
        </div>
      )}
    </div>
  );
}
