import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

export async function saveCandidateResume(file: File | null) {
  if (!file || file.size === 0) {
    return "";
  }

  const extension = path.extname(file.name).toLowerCase();

  if (file.type !== "application/pdf" || extension !== ".pdf") {
    throw new Error("Resume must be a PDF file.");
  }

  if (file.size > MAX_RESUME_SIZE) {
    throw new Error("Resume must be smaller than 5 MB.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "candidates");
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/uploads/candidates/${fileName}`;
}

export async function deleteCandidateResume(resumeUrl: string) {
  if (!resumeUrl.startsWith("/uploads/candidates/")) return;

  const filePath = path.join(process.cwd(), "public", resumeUrl);
  await unlink(filePath).catch(() => undefined);
}
