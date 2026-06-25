import JobCard from "./JobCard";

interface Props {
  jobs: any[];
}

export default function JobGrid({ jobs }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
        />
      ))}
    </div>
  );
}