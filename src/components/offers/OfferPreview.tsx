"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  Mail,
  MapPin,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  markOfferAcceptedAction,
  markOfferRejectedAction,
} from "@/actions/offer.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OfferRecord, OfferStatus } from "@/types/offer";
import OfferForm from "./OfferForm";

interface Props {
  offer: OfferRecord;
  candidates: Array<{
    id: string;
    name: string;
    email: string;
    job?: {
      title: string;
    } | null;
  }>;
}

function getStatus(offer: OfferRecord): OfferStatus {
  if (offer.candidate.status === "Hired") return "Accepted";
  if (offer.candidate.status === "Rejected") return "Rejected";
  return "Sent";
}

export default function OfferPreview({ offer, candidates }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const status = getStatus(offer);

  const updateStatus = (
    action: (id: string) => Promise<{ success: boolean; message?: string }>
  ) => {
    setError("");
    startTransition(async () => {
      const result = await action(offer.id);
      if (!result.success) {
        setError(result.message || "Unable to update the offer.");
      }
    });
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {offer.roleTitle}
          </h1>
          <p className="mt-2 text-slate-600">
            Offer for {offer.candidate.name}
          </p>
        </div>
        <Badge
          variant={
            status === "Accepted"
              ? "default"
              : status === "Rejected"
                ? "destructive"
                : "secondary"
          }
        >
          {status}
        </Badge>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Salary</p>
          <p className="mt-2 font-medium text-slate-900">{offer.salary}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" /> Joining Date
          </p>
          <p className="mt-2 font-medium text-slate-900">
            {new Date(offer.startDate).toLocaleDateString()}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <UserRound className="h-4 w-4" /> Reporting Manager
          </p>
          <p className="mt-2 font-medium text-slate-900">
            {offer.reportingManager}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" /> Work Location
          </p>
          <p className="mt-2 font-medium text-slate-900">{offer.location}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <h2 className="font-semibold text-slate-900">Candidate</h2>
        <p className="mt-2 text-sm text-slate-700">{offer.candidate.name}</p>
        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <Mail className="h-4 w-4" /> {offer.candidate.email}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button asChild size="lg">
          <a href={offer.offerPdfUrl} download>
            <Download className="mr-2 h-4 w-4" /> Download Offer Letter
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={offer.ndaPdfUrl} download>
            <Download className="mr-2 h-4 w-4" /> Download NDA
          </a>
        </Button>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
        <Button asChild variant="outline">
          <Link href="/dashboard/offers">Back to offers</Link>
        </Button>
        <OfferForm
          offer={{
            id: offer.id,
            candidateId: offer.candidateId,
            roleTitle: offer.roleTitle,
            salary: offer.salary,
            startDate: offer.startDate,
            reportingManager: offer.reportingManager,
            location: offer.location,
          }}
          candidates={candidates}
          triggerLabel="Edit Offer"
        />
        {status === "Sent" ? (
          <>
            <Button
              disabled={pending}
              onClick={() => updateStatus(markOfferAcceptedAction)}
            >
              <CheckCircle2 className="mr-1 h-4 w-4" />{" "}
              {pending ? "Updating..." : "Mark Accepted"}
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => updateStatus(markOfferRejectedAction)}
            >
              <XCircle className="mr-1 h-4 w-4" />{" "}
              {pending ? "Updating..." : "Mark Rejected"}
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
