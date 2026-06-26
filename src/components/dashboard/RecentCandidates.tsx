import { format } from "date-fns";

interface Props {
  candidates: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: Date;
    job?: {
      title: string;
    } | null;
  }>;
}

export default function RecentCandidates({ candidates }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">

      <h2 className="text-xl font-semibold mb-6">
        Recent Candidates
      </h2>

      <table className="w-full">

        <thead>

          <tr className="text-left border-b">

            <th className="pb-3">
              Candidate
            </th>

            <th>
              Role
            </th>

            <th>
              Status
            </th>

            <th>
              Last Activity
            </th>

          </tr>

        </thead>

        <tbody>

          {candidates.map((candidate) => (

            <tr
              key={candidate.id}
              className="border-b"
            >

              <td className="py-4">
                {candidate.name}
              </td>

              <td>
                {candidate.job?.title || "No role"}
              </td>

              <td>
                {candidate.status}
              </td>

              <td>
                {format(new Date(candidate.createdAt), "dd MMM yyyy")}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
