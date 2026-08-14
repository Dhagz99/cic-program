"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  useId,
  useRef,
  useState,
} from "react";

type AddBorrowerModalProps = {
  onUpload: (file: File) => Promise<void> | void;
  onCancel?: () => void;
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AddBorrowerModal({
  onUpload,
  onCancel,
}: AddBorrowerModalProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const [isUploading, setIsUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const validateFile = (file: File) => {

     const fileName = file.name.toUpperCase();

  if (fileName !== "CICNEW.DBF") {
    return "The file name must be CICNEW.DBF.";
  }
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (extension !== "dbf") {
      return "Only DBF files are allowed.";
    }

    if (file.size === 0) {
      return "The selected file is empty.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "The DBF file must not exceed 25 MB.";
    }

    return null;
  };

  const selectFile = (file: File) => {
    const validationError =
      validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    selectFile(file);
  };

  const handleDragOver = (
    event: DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();

    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (
    event: DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (
    event: DragEvent<HTMLLabelElement>
  ) => {
    event.preventDefault();
    setIsDragging(false);

    if (isUploading) {
      return;
    }

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      selectFile(file);
    }
  };

  const removeFile = () => {
    if (isUploading) {
      return;
    }

    setSelectedFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(
        "Select an SSPNEW DBF file first."
      );
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      await onUpload(selectedFile);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload the DBF file."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <FileArchive size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Upload new borrower records
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Select the branch CICNEW DBF file.
              The records will be validated and
              added to daily staging for review.
            </p>
          </div>
        </div>
      </div>

      <label
        htmlFor={inputId}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "group flex min-h-52 cursor-pointer flex-col",
          "items-center justify-center rounded-2xl border-2",
          "border-dashed px-6 py-8 text-center transition",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/60",
          isUploading
            ? "pointer-events-none opacity-60"
            : "",
        ].join(" ")}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:scale-105">
          <UploadCloud size={28} />
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-800">
          Drop your DBF file here
        </p>

        <p className="mt-1 text-sm text-slate-500">
          or click to browse from your computer
        </p>

        <span className="mt-4 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
          DBF only · Maximum 25 MB
        </span>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".dbf,application/x-dbf"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </label>

      {selectedFile && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              {selectedFile.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {formatFileSize(
                selectedFile.size
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={removeFile}
            disabled={isUploading}
            aria-label="Remove selected file"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleUpload}
          disabled={
            !selectedFile ||
            isUploading
          }
          className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isUploading ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud size={17} />
              Upload file
            </>
          )}
        </button>
      </div>
    </div>
  );
}