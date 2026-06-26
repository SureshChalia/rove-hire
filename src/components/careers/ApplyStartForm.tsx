"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { startApplicationAction } from "@/actions/candidate.actions";
import {
  startApplicationSchema,
  type StartApplicationValues,
} from "@/lib/application-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ApplyStartForm({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StartApplicationValues>({
    resolver: zodResolver(startApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      jobId,
    },
  });

  function onSubmit(values: StartApplicationValues) {
    setActionError("");
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("jobId", jobId);

    startTransition(async () => {
      const result = await startApplicationAction(formData);

      if (!result.success || !result.applicationPath) {
        setActionError(result.message || "Unable to start your application.");
        return;
      }

      router.push(result.applicationPath);
    });
  }

  return (
    <form
      id="apply"
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
        Apply now
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight">Start your application</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Tell us who you are. We will open your secure application for{" "}
        <span className="font-semibold text-slate-700">{jobTitle}</span>.
      </p>

      <input type="hidden" {...register("jobId")} />

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="start-name">Full name</Label>
          <Input
            id="start-name"
            autoComplete="name"
            placeholder="Your full name"
            className="h-11"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="start-email">Email address</Label>
          <Input
            id="start-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      {actionError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-base hover:bg-blue-700"
      >
        {pending ? (
          <>
            <LoaderCircle className="animate-spin" /> Starting...
          </>
        ) : (
          <>
            Continue <ArrowRight />
          </>
        )}
      </Button>
      <p className="mt-3 text-center text-xs leading-5 text-slate-400">
        No account required. Your secure link remains valid for 14 days.
      </p>
    </form>
  );
}
