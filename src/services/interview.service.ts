import { prisma } from "@/lib/prisma";
import {
  CreateInterviewPayload,
  Recommendation,
  UpdateInterviewPayload,
} from "@/types/interview";

export async function getInterviews(search?: string) {
  return prisma.interview.findMany({
    where: search
      ? {
          OR: [
            {
              interviewer: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              notes: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    include: {
      candidate: {
        include: {
          job: true,
        },
      },
    },
    orderBy: {
      interviewDate: "asc",
    },
  });
}

export async function getInterviewById(id: string) {
  return prisma.interview.findUnique({
    where: {
      id,
    },
    include: {
      candidate: {
        include: {
          job: true,
        },
      },
    },
  });
}

export async function createInterview(data: CreateInterviewPayload) {
  return prisma.$transaction(async (tx) => {
    const interview = await tx.interview.create({
      data: {
        candidateId: data.candidateId,
        interviewer: data.interviewer,
        type: data.type,
        interviewDate: new Date(data.interviewDate),
        interviewTime: data.interviewTime,
        duration: data.duration,
        meetingLink: data.meetingLink ?? null,
        notes: data.notes ?? null,
        status: data.status ?? "Scheduled",
      },
    });

    await tx.candidate.update({
      where: {
        id: data.candidateId,
      },
      data: {
        status: "InterviewScheduled",
      },
    });

    await tx.timeline.create({
      data: {
        candidateId: data.candidateId,
        title: "Interview Scheduled",
        description: `Interview scheduled with ${data.interviewer}`,
      },
    });

    return interview;
  });
}

export async function updateInterview(data: UpdateInterviewPayload) {
  const { id, ...rest } = data;

  return prisma.interview.update({
    where: {
      id,
    },
    data: {
      candidateId: rest.candidateId,
      interviewer: rest.interviewer,
      type: rest.type,
      interviewDate: rest.interviewDate ? new Date(rest.interviewDate) : undefined,
      interviewTime: rest.interviewTime,
      duration: rest.duration,
      meetingLink: rest.meetingLink ?? null,
      notes: rest.notes ?? null,
      status: rest.status,
    },
  });
}

export async function deleteInterview(id: string) {
  return prisma.interview.delete({
    where: {
      id,
    },
  });
}

export async function completeInterview(
  id: string,
  recommendation: Recommendation,
  feedback?: string | null,
  rating?: number | null
) {
  return prisma.$transaction(async (tx) => {
    const interview = await tx.interview.update({
      where: {
        id,
      },
      data: {
        status: "Completed",
        recommendation: recommendation as "Hire" | "Maybe" | "Reject",
        feedback: feedback ?? null,
        rating: rating ?? null,
      },
    });

    let candidateStatus: "InterviewCompleted" | "OfferSent" | "Rejected" = "InterviewCompleted";

    if (recommendation === "Hire") {
      candidateStatus = "OfferSent";
    }

    if (recommendation === "Reject") {
      candidateStatus = "Rejected";
    }

    await tx.candidate.update({
      where: {
        id: interview.candidateId,
      },
      data: {
        status: candidateStatus as "Applied" | "FormSubmitted" | "InterviewScheduled" | "InterviewCompleted" | "OfferSent" | "Hired" | "Rejected",
      },
    });

    await tx.timeline.create({
      data: {
        candidateId: interview.candidateId,
        title: "Interview Completed",
        description: "Interview was completed successfully.",
      },
    });

    if (recommendation === "Hire") {
      await tx.timeline.create({
        data: {
          candidateId: interview.candidateId,
          title: "Hire",
          description: "Candidate was recommended for hire.",
        },
      });
    }

    if (recommendation === "Maybe") {
      await tx.timeline.create({
        data: {
          candidateId: interview.candidateId,
          title: "Maybe",
          description: "Candidate was marked as maybe for the role.",
        },
      });
    }

    if (recommendation === "Reject") {
      await tx.timeline.create({
        data: {
          candidateId: interview.candidateId,
          title: "Reject",
          description: "Candidate was rejected after the interview.",
        },
      });
    }

    return interview;
  });
}

export async function changeInterviewStatus(id: string, status: string) {
  const interview = await prisma.interview.update({
    where: {
      id,
    },
    data: {
      status: status as "Scheduled" | "Completed" | "Cancelled",
    },
  });

  if (status === "Completed") {
    await prisma.timeline.create({
      data: {
        candidateId: interview.candidateId,
        title: "Interview Completed",
        description: "Interview status was updated to completed.",
      },
    });

    await prisma.candidate.update({
      where: {
        id: interview.candidateId,
      },
      data: {
        status: "InterviewCompleted" as "Applied" | "FormSubmitted" | "InterviewScheduled" | "InterviewCompleted" | "OfferSent" | "Hired" | "Rejected",
      },
    });
  }

  return interview;
}
