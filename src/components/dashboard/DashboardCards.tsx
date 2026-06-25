import {
  Users,
  BriefcaseBusiness,
  Calendar,
  FileText,
} from "lucide-react";

import StatCard from "./StatCard";

interface Props {
  totalCandidates: number;
  totalJobs: number;
  totalInterviews: number;
  totalOffers: number;
}

export default function DashboardCards({
  totalCandidates,
  totalJobs,
  totalInterviews,
  totalOffers,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <StatCard
        title="Candidates"
        value={totalCandidates}
        icon={<Users className="text-blue-600" />}
      />

      <StatCard
        title="Jobs"
        value={totalJobs}
        icon={<BriefcaseBusiness className="text-green-600" />}
      />

      <StatCard
        title="Interviews"
        value={totalInterviews}
        icon={<Calendar className="text-orange-600" />}
      />

      <StatCard
        title="Offers"
        value={totalOffers}
        icon={<FileText className="text-purple-600" />}
      />

    </div>
  );
}