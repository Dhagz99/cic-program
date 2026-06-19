"use client";

import { useImportDbf } from "@/hooks/imports/useImportDbf";
import { Upload, FileArchive } from "lucide-react";

import { useState } from "react";


export default function InitializeData() {
  const [file, setFile] =
    useState<File | null>(null);

  const { mutateAsync, isPending } =
    useImportDbf();




  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    await mutateAsync(formData);
  };



  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Initialize Data
        </h1>

        <p className="text-slate-500 mt-1">
          Upload and import legacy DBF files
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        {/* DROPZONE */}
        <div
          className="
            border-2 border-dashed border-slate-300
            rounded-3xl
            p-12
            flex flex-col items-center justify-center
          "
        >
          {/* ICON */}
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <FileArchive
              className="text-blue-600"
              size={40}
            />
          </div>

          {/* TITLE */}
          <h2 className="mt-6 text-2xl font-semibold text-slate-800">
            Upload DBF File
          </h2>

          <p className="text-slate-500 mt-2 text-sm">
            Supported format: .dbf
          </p>

          {/* INPUT */}
          <input
            type="file"
            accept=".dbf"
            className="mt-8"
            onChange={(e) =>
              setFile(
                e.target.files?.[0] || null
              )
            }
          />

          {/* FILE NAME */}
          {file && (
            <div className="mt-6 px-4 py-3 rounded-2xl bg-slate-100 text-sm text-slate-700">
              Selected File:{" "}
              <span className="font-medium">
                {file.name}
              </span>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={!file || isPending}
            className="
              mt-8
              h-12 px-8
              rounded-2xl
              bg-blue-600 hover:bg-blue-700
              transition
              text-white
              font-medium
              flex items-center gap-2
              disabled:opacity-50
            "
          >
            <Upload size={18} />

            {isPending
              ? "Importing..."
              : "Import DBF"}
          </button>
        </div>
      </div>
    </div>
  );
}