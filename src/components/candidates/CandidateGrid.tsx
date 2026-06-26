import CandidateCard from "./CandidateCard";

interface Props {
  candidates: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    linkedin?: string | null;
    currentRole?: string | null;
    location?: string | null;
    noticePeriod?: string | null;
    salaryExpectation?: string | null;
    jobId?: string;
    resumeUrl?: string;
    status: string;
    magicToken?: string | null;
    formSubmitted?: boolean;
    createdAt: Date;
    job?: {
      title: string;
    } | null;
  }>;
  jobs: Array<{
    id: string;
    title: string;
  }>;
}

export default function CandidateGrid({ candidates, jobs }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} jobs={jobs} />
      ))}
    </div>
  );
}
