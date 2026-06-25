import { notFound } from "next/navigation";
import { CandidateDetails } from "@/components/candidates";
import { getCandidateById } from "@/services/candidate.service";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CandidateDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const candidate = await getCandidateById(resolvedParams.id);

  if (!candidate) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <a href="/dashboard/candidates" className="text-sm font-medium text-blue-600">
          ← Back to candidates
        </a>
      </div>

      <CandidateDetails
        candidate={{
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          linkedin: candidate.linkedin,
          currentRole: candidate.currentRole,
          location: candidate.location,
          noticePeriod: candidate.noticePeriod,
          salaryExpectation: candidate.salaryExpectation,
          resumeUrl: candidate.resumeUrl,
          status: candidate.status,
          createdAt: candidate.createdAt,
          job: candidate.job,
          interviews: candidate.interviews,
          timelines: candidate.timelines,
        }}
      />
    </div>
  );
}
