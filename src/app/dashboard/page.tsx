import DashboardCards from "@/components/dashboard/DashboardCards";
import RecentCandidates from "@/components/dashboard/RecentCandidates";
import RecentOffers from "@/components/dashboard/RecentOffers";
import { getDashboardStats } from "@/services/dashboard.service";

export default async function DashboardPage() {
  const data = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back 👋
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
