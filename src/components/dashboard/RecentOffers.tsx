import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { OfferRecord } from "@/types/offer";

interface Props {
  offers: OfferRecord[];
}

export default function RecentOffers({ offers }: Props) {
  return (
    <div className="mt-8 rounded-xl border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Recent Offers</h2>
        <Link
          href="/dashboard/offers"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {offers.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          No offers have been generated yet.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="pb-3 font-medium">Candidate</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Salary</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => {
                const status =
                  offer.candidate.status === "Hired"
                    ? "Accepted"
                    : offer.candidate.status === "Rejected"
                      ? "Rejected"
                      : "Sent";

                return (
                  <tr key={offer.id} className="border-b last:border-0">
                    <td className="py-4 font-medium text-slate-900">
                      <Link
                        href={`/dashboard/offers/${offer.id}`}
                        className="hover:text-blue-600"
                      >
                        {offer.candidate.name}
                      </Link>
                    </td>
                    <td className="py-4 text-slate-600">{offer.roleTitle}</td>
                    <td className="py-4 text-slate-600">{offer.salary}</td>
                    <td className="py-4">
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
                    </td>
                    <td className="py-4 text-slate-500">
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
