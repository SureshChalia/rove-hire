import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    totalJobs,
    totalCandidates,
    totalInterviews,
    totalOffers,
    recentCandidates,
    recentOffers,
  ] = await Promise.all([
    prisma.job.count(),

    prisma.candidate.count(),

    prisma.interview.count(),

    prisma.offerDocument.count(),

    prisma.candidate.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        job: true,
      },
    }),

    prisma.offerDocument.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        candidate: {
          include: {
            job: true,
          },
        },
      },
    }),
  ]);

  return {
    totalJobs,
    totalCandidates,
    totalInterviews,
    totalOffers,
    recentCandidates,
    recentOffers,
  };
}
