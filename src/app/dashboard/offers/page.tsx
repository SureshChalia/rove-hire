import { Suspense } from "react";

import { OfferForm, OfferGrid } from "@/components/offers";
import { Button } from "@/components/ui/button";
import { getCandidates } from "@/services/candidate.service";
import { getOffers } from "@/services/offer.service";

export default async function OffersPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search?.trim();
  const [offers, candidates] = await Promise.all([
    getOffers(search),
    getCandidates(),
  ]);

  const candidateOptions = candidates.map((candidate) => ({
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    job: candidate.job,
  }));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Offers</h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Generate, track, and manage candidate offer documents.
          </p>
        </div>
        <OfferForm candidates={candidateOptions} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Offers</p>
          <p className="mt-2 text-2xl font-semibold">{offers.length}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Accepted</p>
          <p className="mt-2 text-2xl font-semibold">
            {
              offers.filter((offer) => offer.candidate.status === "Hired")
                .length
            }
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Awaiting Response</p>
          <p className="mt-2 text-2xl font-semibold">
            {
              offers.filter(
                (offer) =>
                  offer.candidate.status !== "Hired" &&
                  offer.candidate.status !== "Rejected"
              ).length
            }
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">
            {offers.length} offer{offers.length === 1 ? "" : "s"} found
          </p>
          <form
            method="GET"
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <input
              name="search"
              defaultValue={search || ""}
              placeholder="Search candidate or role"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none sm:w-72"
            />
            <Button
              type="submit"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      <Suspense
        fallback={<div className="text-sm text-slate-500">Loading offers...</div>}
      >
        <OfferGrid offers={offers} candidates={candidateOptions} />
      </Suspense>
    </div>
  );
}
