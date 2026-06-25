import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  StandardFonts,
  rgb,
} from "pdf-lib";
import { format } from "date-fns";

import type { OfferPdfInput } from "@/types/offer";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const BODY_SIZE = 11;
const LINE_HEIGHT = 17;

function toPdfText(value: string) {
  return value
    .replaceAll("₹", "Rs. ")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("’", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "");
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const paragraphs = toPdfText(text).split(/\r?\n/);
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }

    const words = paragraph.split(/\s+/);
    let line = "";

    for (const word of words) {
      const nextLine = line ? `${line} ${word}` : word;

      if (font.widthOfTextAtSize(nextLine, size) <= maxWidth) {
        line = nextLine;
      } else {
        if (line) lines.push(line);
        line = word;
      }
    }

    if (line) lines.push(line);
  }

  return lines;
}

function addPageNumber(page: PDFPage, font: PDFFont, pageNumber: number) {
  page.drawText(`Page ${pageNumber}`, {
    x: PAGE_WIDTH - MARGIN - 42,
    y: 28,
    size: 8,
    font,
    color: rgb(0.45, 0.49, 0.56),
  });
}

function createDocumentWriter(document: PDFDocument, font: PDFFont) {
  let page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let pageNumber = 1;
  let y = PAGE_HEIGHT - MARGIN;

  const ensureSpace = (height: number) => {
    if (y - height >= MARGIN) return;

    addPageNumber(page, font, pageNumber);
    page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pageNumber += 1;
    y = PAGE_HEIGHT - MARGIN;
  };

  const write = (
    text: string,
    options?: {
      size?: number;
      lineHeight?: number;
      color?: ReturnType<typeof rgb>;
      font?: PDFFont;
      spacingAfter?: number;
    }
  ) => {
    const activeFont = options?.font ?? font;
    const size = options?.size ?? BODY_SIZE;
    const lineHeight = options?.lineHeight ?? LINE_HEIGHT;
    const lines = wrapText(text, activeFont, size, PAGE_WIDTH - MARGIN * 2);

    for (const line of lines) {
      ensureSpace(lineHeight);
      page.drawText(line, {
        x: MARGIN,
        y,
        size,
        font: activeFont,
        color: options?.color ?? rgb(0.12, 0.16, 0.23),
      });
      y -= lineHeight;
    }

    y -= options?.spacingAfter ?? 8;
  };

  const finish = () => addPageNumber(page, font, pageNumber);

  return { write, finish };
}

async function createPdf(
  title: string,
  subtitle: string,
  sections: Array<{ heading?: string; body: string }>
) {
  const document = await PDFDocument.create();
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const writer = createDocumentWriter(document, regular);

  document.setTitle(title);
  document.setAuthor("ROVE Hire");
  document.setCreator("ROVE Hire ATS");

  writer.write("ROVE HIRE", {
    size: 12,
    font: bold,
    color: rgb(0.15, 0.39, 0.92),
    spacingAfter: 12,
  });
  writer.write(title, {
    size: 24,
    lineHeight: 30,
    font: bold,
    spacingAfter: 4,
  });
  writer.write(subtitle, {
    size: 10,
    color: rgb(0.39, 0.45, 0.55),
    spacingAfter: 22,
  });

  for (const section of sections) {
    if (section.heading) {
      writer.write(section.heading, {
        size: 12,
        font: bold,
        color: rgb(0.15, 0.39, 0.92),
        spacingAfter: 3,
      });
    }

    writer.write(section.body, { spacingAfter: 12 });
  }

  writer.finish();
  return document.save();
}

export async function generateOfferLetterPdf(input: OfferPdfInput) {
  const joiningDate = format(input.startDate, "MMMM d, yyyy");

  return createPdf(
    "Offer Letter",
    `Generated on ${format(new Date(), "MMMM d, yyyy")}`,
    [
      {
        body: `Dear ${input.candidateName},`,
      },
      {
        body: `We are pleased to offer you the position of ${input.roleTitle} at ROVE Hire. We were impressed by your experience and look forward to the contribution you will make to the team.`,
      },
      {
        heading: "Offer Details",
        body: `Role Title: ${input.roleTitle}\nSalary: ${input.salary}\nJoining Date: ${joiningDate}\nReporting Manager: ${input.reportingManager}\nWork Location: ${input.location}`,
      },
      ...(input.notes
        ? [
            {
              heading: "Additional Notes",
              body: input.notes,
            },
          ]
        : []),
      {
        body: "This offer is subject to successful completion of applicable pre-employment checks and acceptance of the accompanying confidentiality agreement.",
      },
      {
        body: "Please sign and return the offer documents to confirm your acceptance. We are excited about the possibility of welcoming you to the team.",
      },
      {
        body: `Sincerely,\n${input.reportingManager}\nROVE Hire`,
      },
    ]
  );
}

export async function generateNdaPdf(input: OfferPdfInput) {
  return createPdf(
    "Non-Disclosure Agreement",
    `Candidate: ${input.candidateName} (${input.candidateEmail})`,
    [
      {
        heading: "1. Purpose",
        body: `This Non-Disclosure Agreement is entered into between ROVE Hire and ${input.candidateName} in connection with the candidate's employment as ${input.roleTitle}.`,
      },
      {
        heading: "2. Confidential Information",
        body: "Confidential Information includes business plans, customer information, product plans, software, source code, financial information, processes, trade secrets, and any non-public information disclosed during or after employment.",
      },
      {
        heading: "3. Obligations",
        body: "The candidate agrees to protect Confidential Information, use it only for authorized work, and not disclose it to any third party without prior written authorization.",
      },
      {
        heading: "4. Exclusions",
        body: "These obligations do not apply to information that is publicly available through no breach of this agreement, was lawfully known before disclosure, or is independently developed without use of Confidential Information.",
      },
      {
        heading: "5. Return of Information",
        body: "Upon request or termination of employment, the candidate will promptly return or securely destroy company property and Confidential Information in their possession.",
      },
      {
        heading: "6. Continuing Obligation",
        body: "The confidentiality obligations in this agreement continue after employment ends to the extent permitted by applicable law.",
      },
      {
        body: `Candidate: ${input.candidateName}\nRole: ${input.roleTitle}\nJoining Date: ${format(input.startDate, "MMMM d, yyyy")}\n\nCandidate Signature: ____________________\nDate: ____________________`,
      },
    ]
  );
}

export async function saveOfferPdf(
  bytes: Uint8Array,
  candidateName: string,
  documentType: "offer-letter" | "nda"
) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "offers");
  await mkdir(uploadDir, { recursive: true });

  const safeName =
    candidateName.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") ||
    "candidate";
  const fileName = `${Date.now()}-${safeName}-${documentType}.pdf`;

  await writeFile(path.join(uploadDir, fileName), Buffer.from(bytes));

  return `/uploads/offers/${fileName}`;
}

export async function deleteOfferPdf(pdfUrl?: string | null) {
  if (!pdfUrl?.startsWith("/uploads/offers/")) return;

  const filePath = path.join(process.cwd(), "public", pdfUrl);

  try {
    await unlink(filePath);
  } catch {
    // The database record can still be removed if an old local file is absent.
  }
}
