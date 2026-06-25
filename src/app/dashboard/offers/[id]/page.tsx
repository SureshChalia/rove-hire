import { notFound } from "next/navigation";

import { OfferPreview } from "@/components/offers";
import { getCandidates } from "@/services/candidate.service";
import { getOfferById } from "@/services/offer.service";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OfferDetailsPage({ params }: Props) {
  const { id } = await params;
  const [offer, candidates] = await Promise.all([
    getOfferById(id),
    getCandidates(),
  ]);

  if (!offer) {
    notFound();
  }

  return (
    <OfferPreview
      offer={offer}
      candidates={candidates.map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        job: candidate.job,
      }))}
    />
  );
}
