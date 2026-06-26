import { FileBadge } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import type { OfferRecord } from "@/types/offer";
import OfferCard from "./OfferCard";
import OfferForm from "./OfferForm";

interface Props {
  offers: OfferRecord[];
  candidates: Array<{
    id: string;
    name: string;
    email: string;
    job?: {
      title: string;
    } | null;
  }>;
}

export default function OfferGrid({ offers, candidates }: Props) {
  if (!offers.length) {
    return (
      <EmptyState
        icon={FileBadge}
        title="No offers yet"
        description="Generate an offer to create the offer letter and NDA for your shortlisted candidates."
        action={<OfferForm candidates={candidates} />}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} candidates={candidates} />
      ))}
    </div>
  );
}
