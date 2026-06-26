import { Skeleton } from "@/components/ui/skeleton";

export default function ApplyLoading() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-14 w-3/4" />
        <Skeleton className="mt-6 h-32 rounded-2xl" />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
