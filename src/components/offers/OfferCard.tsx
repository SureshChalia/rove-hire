"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  MapPin,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  deleteOfferAction,
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

function getOfferStatus(offer: OfferRecord): OfferStatus {
  if (offer.candidate.status === "Hired") return "Accepted";
  if (offer.candidate.status === "Rejected") return "Rejected";
  return "Sent";
}

export default function OfferCard({ offer, candidates }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const status = getOfferStatus(offer);

  const runAction = (
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

  const handleDelete = () => {
    if (!window.confirm("Delete this offer and its generated PDFs?")) return;
    runAction(deleteOfferAction);
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">
            {offer.candidate.name}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{offer.roleTitle}</p>
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

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <p className="font-medium text-slate-800">{offer.salary}</p>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>
            Joins {new Date(offer.startDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          <span>{offer.reportingManager}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{offer.location}</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button asChild size="sm" variant="outline">
          <a href={offer.offerPdfUrl} download>
            <Download className="mr-1 h-4 w-4" /> Offer Letter
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={offer.ndaPdfUrl} download>
            <Download className="mr-1 h-4 w-4" /> NDA
          </a>
        </Button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/offers/${offer.id}`}>
            <Eye className="mr-1 h-4 w-4" /> View
          </Link>
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
        />
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={handleDelete}
        >
          <Trash2 className="mr-1 h-4 w-4" /> Delete
        </Button>
      </div>

      {status === "Sent" ? (
        <div className="mt-3 flex flex-wrap gap-2 border-t pt-4">
          <Button
            size="sm"
            disabled={pending}
            onClick={() => runAction(markOfferAcceptedAction)}
          >
            <CheckCircle2 className="mr-1 h-4 w-4" /> Mark Accepted
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => runAction(markOfferRejectedAction)}
          >
            <XCircle className="mr-1 h-4 w-4" /> Mark Rejected
          </Button>
        </div>
      ) : null}
    </div>
  );
}
