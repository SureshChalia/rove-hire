import type { OfferRecord } from "@/types/offer";
import OfferCard from "./OfferCard";

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
      <div className="rounded-2xl border border-dashed bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">No offers yet</h2>
        <p className="mt-2 text-sm text-slate-500">
          Generate an offer to create the offer letter and NDA.
        </p>
      </div>
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
