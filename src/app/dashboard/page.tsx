import DashboardCards from "@/components/dashboard/DashboardCards";
import RecentCandidates from "@/components/dashboard/RecentCandidates";
import RecentOffers from "@/components/dashboard/RecentOffers";
import { getDashboardStats } from "@/services/dashboard.service";

export default async function DashboardPage() {
  const data = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back. Here is a snapshot of your hiring pipeline.
        </p>
      </div>

      <DashboardCards
        totalCandidates={data.totalCandidates}
        totalJobs={data.totalJobs}
        totalInterviews={data.totalInterviews}
        totalOffers={data.totalOffers}
      />

      <RecentCandidates
        candidates={data.recentCandidates}
      />

      <RecentOffers offers={data.recentOffers} />
    </div>
  );
}
