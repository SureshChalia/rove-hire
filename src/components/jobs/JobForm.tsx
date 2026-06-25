"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  createJobAction,
  updateJobAction,
} from "@/actions/job.actions";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  skills: z.string().min(2),

  department: z.string().optional(),

  location: z.string().optional(),

  employmentType: z.string().optional(),

  experience: z.string().optional(),

  salary: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  job?: {
    id: string;

    title: string;

    description: string;

    skills: string[];

    department?: string | null;

    location?: string | null;

    employmentType?: string | null;

    experience?: string | null;

    salary?: string | null;
  };
  triggerLabel?: string;
}

export default function JobForm({ job, triggerLabel }: Props) {
  const [pending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const populateForm = (currentJob?: Props["job"]) => {
    if (!currentJob) {
      reset({
        title: "",
        description: "",
        skills: "",
        department: "",
        location: "",
        employmentType: "",
        experience: "",
        salary: "",
      });
      return;
    }

    setValue("title", currentJob.title);

    setValue("description", currentJob.description);

    setValue("skills", currentJob.skills.join(","));

    setValue("department", currentJob.department || "");

    setValue("location", currentJob.location || "");

    setValue(
      "employmentType",
      currentJob.employmentType || ""
    );

    setValue(
      "experience",
      currentJob.experience || ""
    );

    setValue("salary", currentJob.salary || "");
  };

  useEffect(() => {
    populateForm(job);
  }, [job, reset, setValue]);

    async function onSubmit(data: FormData) {
    const formData = new FormData();

    if (job) {
      formData.append("id", job.id);
    }

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("skills", data.skills);

    formData.append(
      "department",
      data.department || ""
    );

    formData.append(
      "location",
      data.location || ""
    );

    formData.append(
      "employmentType",
      data.employmentType || ""
    );

    formData.append(
      "experience",
      data.experience || ""
    );

    formData.append(
      "salary",
      data.salary || ""
    );

    startTransition(async () => {
      if (job) {
        await updateJobAction(formData);
      } else {
        await createJobAction(formData);
      }

      reset();

      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          populateForm(job);
          return;
        }

        reset({
          title: "",
          description: "",
          skills: "",
          department: "",
          location: "",
          employmentType: "",
          experience: "",
          salary: "",
        });
      }}
    >

      <DialogTrigger asChild>

        {job ? (

          <Button size="sm" variant="outline">
            {triggerLabel || "Edit"}
          </Button>

        ) : (

          <Button size="lg">
            + Create Job
          </Button>

        )}

      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">

        <DialogHeader>

          <DialogTitle className="text-2xl">

            {job
              ? "Edit Job"
              : "Create New Job"}

          </DialogTitle>

        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="text-sm font-medium">
                Job Title
              </label>

              <Input
                placeholder="Frontend Developer"
                {...register("title")}
              />

              <p className="mt-1 text-sm text-red-500">
                {errors.title?.message}
              </p>

            </div>

            <div>

              <label className="text-sm font-medium">
                Department
              </label>

              <Input
                placeholder="Engineering"
                {...register("department")}
              />

            </div>

            <div>

              <label className="text-sm font-medium">
                Location
              </label>

              <Input
                placeholder="Remote"
                {...register("location")}
              />

            </div>

            <div>

              <label className="text-sm font-medium">
                Employment Type
              </label>

              <Input
                placeholder="Full Time"
                {...register("employmentType")}
              />

            </div>

            <div>

              <label className="text-sm font-medium">
                Experience
              </label>

              <Input
                placeholder="3+ Years"
                {...register("experience")}
              />

            </div>

            <div>

              <label className="text-sm font-medium">
                Salary
              </label>

              <Input
                placeholder="₹10-15 LPA"
                {...register("salary")}
              />

            </div>

          </div>
                    <div>

            <label className="text-sm font-medium">
              Description
            </label>

            <Textarea
              rows={6}
              placeholder="Describe the role..."
              {...register("description")}
            />

            <p className="mt-1 text-sm text-red-500">
              {errors.description?.message}
            </p>

          </div>

          <div>

            <label className="text-sm font-medium">
              Skills
            </label>

            <Input
              placeholder="React, Next.js, TypeScript"
              {...register("skills")}
            />

            <p className="mt-1 text-sm text-red-500">
              {errors.skills?.message}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Separate skills using commas.
            </p>

          </div>

          <DialogFooter className="gap-2">

            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={pending}
            >
              {pending
                ? job
                  ? "Updating..."
                  : "Creating..."
                : job
                ? "Update Job"
                : "Create Job"}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>
  );
}