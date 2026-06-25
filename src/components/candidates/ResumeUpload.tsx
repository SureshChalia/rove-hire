"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, UploadCloud } from "lucide-react";

interface Props {
  value?: string;
  onFileChange: (file: File | null) => void;
}

export default function ResumeUpload({ value, onFileChange }: Props) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(value ? value.split("/").pop() || null : null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    setSelectedFileName(file.name);
    onFileChange(file);
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  return (
    <div className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border border-dashed p-6 text-center transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto mb-2 h-6 w-6 text-slate-500" />
        <p className="text-sm font-medium text-slate-700">
          {isDragActive ? "Drop the PDF here" : "Drag & drop a PDF resume or click to browse"}
        </p>
        <p className="mt-1 text-xs text-slate-500">Only PDF files are supported.</p>
      </div>

      {selectedFileName && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-slate-600">
          <FileText className="h-4 w-4" />
          <span>{selectedFileName}</span>
        </div>
      )}
    </div>
  );
}
