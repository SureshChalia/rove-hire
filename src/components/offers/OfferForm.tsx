"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  createOfferAction,
  updateOfferAction,
} from "@/actions/offer.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { OfferFormValues } from "@/types/offer";

const schema = z.object({
  candidateId: z.string().min(1, "Select a candidate"),
  roleTitle: z.string().min(2, "Role title is required"),
  salary: z.string().min(1, "Salary is required"),
  startDate: z.string().min(1, "Joining date is required"),
  reportingManager: z.string().min(2, "Reporting manager is required"),
  location: z.string().min(2, "Work location is required"),
  notes: z.string(),
});

interface Props {
  offer?: {
    id: string;
    candidateId: string;
    roleTitle: string;
    salary: string;
    startDate: Date;
    reportingManager: string;
    location: string;
  };
  candidates: Array<{
    id: string;
    name: string;
    email: string;
    job?: {
      title: string;
    } | null;
  }>;
  triggerLabel?: string;
}

const emptyValues: OfferFormValues = {
  candidateId: "",
  roleTitle: "",
  salary: "",
  startDate: "",
  reportingManager: "",
  location: "",
  notes: "",
};

export default function OfferForm({
  offer,
  candidates,
  triggerLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const populateForm = (currentOffer?: Props["offer"]) => {
    setActionError("");

    if (!currentOffer) {
      reset(emptyValues);
      return;
    }

    setValue("candidateId", currentOffer.candidateId);
    setValue("roleTitle", currentOffer.roleTitle);
    setValue("salary", currentOffer.salary);
    setValue(
      "startDate",
      new Date(currentOffer.startDate).toISOString().split("T")[0]
    );
    setValue("reportingManager", currentOffer.reportingManager);
    setValue("location", currentOffer.location);
    setValue("notes", "");
  };

  function onSubmit(data: OfferFormValues) {
    setActionError("");

    const formData = new FormData();

    if (offer) {
      formData.append("id", offer.id);
    }

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(async () => {
      const result = offer
        ? await updateOfferAction(formData)
        : await createOfferAction(formData);

      if (!result.success) {
        setActionError(result.message || "Unable to save the offer.");
        return;
      }

      reset(emptyValues);
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        populateForm(nextOpen ? offer : undefined);
      }}
    >
      <DialogTrigger asChild>
        {offer ? (
          <Button size="sm" variant="outline">
            {triggerLabel || "Edit"}
          </Button>
        ) : (
          <Button size="lg">+ Generate Offer</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[96vw] max-w-4xl overflow-hidden p-0 sm:w-[92vw]">
        <div className="max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl sm:text-2xl">
              {offer ? "Update Offer" : "Generate Offer"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Candidate</label>
                <select
                  className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none"
                  {...register("candidateId")}
                >
                  <option value="">Select a candidate</option>
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name} - {candidate.job?.title || candidate.email}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-red-500">
                  {errors.candidateId?.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Role Title</label>
                <Input
                  placeholder="Senior Frontend Engineer"
                  {...register("roleTitle")}
                />
                <p className="mt-1 text-sm text-red-500">
                  {errors.roleTitle?.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Salary</label>
                <Input placeholder="INR 18-22 LPA" {...register("salary")} />
                <p className="mt-1 text-sm text-red-500">
                  {errors.salary?.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Joining Date</label>
                <Input type="date" {...register("startDate")} />
                <p className="mt-1 text-sm text-red-500">
                  {errors.startDate?.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Reporting Manager
                </label>
                <Input
                  placeholder="Priya Sharma"
                  {...register("reportingManager")}
                />
                <p className="mt-1 text-sm text-red-500">
                  {errors.reportingManager?.message}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Work Location</label>
                <Input
                  placeholder="Bengaluru / Hybrid"
                  {...register("location")}
                />
                <p className="mt-1 text-sm text-red-500">
                  {errors.location?.message}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  rows={4}
                  placeholder="Add terms or instructions to the offer letter"
                  {...register("notes")}
                />
                {offer ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Notes are embedded in the regenerated PDF and are not stored
                    separately.
                  </p>
                ) : null}
              </div>
            </div>

            {actionError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {actionError}
              </div>
            ) : null}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending
                  ? offer
                    ? "Updating..."
                    : "Generating..."
                  : offer
                    ? "Update Offer"
                    : "Generate Offer"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
