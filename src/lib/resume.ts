import { promises as fs } from "fs";
import os from "os";
import path from "path";
import cloudinary from "./cloudinary";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

export async function saveCandidateResume(file: File | null) {
  if (!file || file.size === 0) {
    return "";
  }

  const extension = path.extname(file.name).toLowerCase();

  if (file.type !== "application/pdf" || extension !== ".pdf") {
    throw new Error("Resume must be a PDF.");
  }

  if (file.size > MAX_RESUME_SIZE) {
    throw new Error("Resume must be smaller than 5 MB.");
  }

  console.log("========== PDF DEBUG ==========");
  console.log("Original Name:", file.name);
  console.log("Original Type:", file.type);
  console.log("Original Size:", file.size);

  const tempPath = path.join(
    os.tmpdir(),
    `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
  );

  const buffer = Buffer.from(await file.arrayBuffer());

  console.log("Buffer Length:", buffer.length);

  await fs.writeFile(tempPath, buffer);

  const stat = await fs.stat(tempPath);

  console.log("Temp File Size:", stat.size);

  const result = await cloudinary.uploader.upload(tempPath, {
    resource_type: "raw",
    folder: "rove-hire/resumes",
    public_id: file.name.replace(".pdf", ""),
    format: "pdf",
    use_filename: false,
    unique_filename: true,
  });

  console.log("========== CLOUDINARY ==========");
  console.log(result);

  await fs.unlink(tempPath);

  console.log(result);

  return result.secure_url;
}

export async function deleteCandidateResume(resumeUrl: string) {
  if (!resumeUrl) return;

  try {
    const uploadPrefix = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/`;

    if (!resumeUrl.startsWith(uploadPrefix)) return;

    let publicId = resumeUrl.replace(uploadPrefix, "");

    // remove version
    publicId = publicId.replace(/^v\d+\//, "");

    // remove extension
    publicId = publicId.replace(/\.pdf$/, "");

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
  } catch (error) {
    console.error(error);
  }
}