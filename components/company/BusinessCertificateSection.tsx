"use client";

import { useState } from "react";

export default function BusinessCertificateSection() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="bg-white w-100 rounded border">
      
      {/* HEADER */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer border-b"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            Business Registration Certificate Information
          </span>
        </div>

        {/* Arrow */}
        <i
          className={`fa-solid ${
            open ? "fa-chevron-up" : "fa-chevron-down"
          }`}
        />
      </div>

      {/* BODY */}
      {open && (
        <div className="p-4">

          <p className="mb-4">
            Please choose your preferred upload method, see instructions{" "}
            <a
              href="https://drive.google.com/file/d/1RSlBTKDRA2s6oRyNgfzAHdnnTyl2_j3g/view"
              target="_blank"
              className="text-green-600"
            >
              here
            </a>
          </p>

          {/* OPTION 1 */}
          <div className="mb-6">
            <label className="flex items-center gap-2 font-semibold">
              <input type="radio" defaultChecked />
              Business registration certificate or equivalent
            </label>

            {/* FILE UPLOAD */}
            <div className="border border-dashed p-4 mt-3 rounded text-center">
              <p className="text-gray-500">
                Select or drag file here
              </p>
              <p className="text-sm text-gray-400">
                Max size: 5MB (jpeg, jpg, png, pdf)
              </p>

              <input
                type="file"
                accept=".jpeg,.jpg,.png,.pdf"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="mt-2"
              />
            </div>

            {/* WARNING */}
            <div className="mt-3 text-sm text-yellow-600">
              <ul className="list-disc ml-5">
                <li>Document must be clear, no editing</li>
                <li>Information must match tax system</li>
              </ul>
            </div>
          </div>

          {/* OPTION 2 */}
          <div className="mb-6">
            <label className="flex items-center gap-2 font-semibold">
              <input type="radio" />
              Power of Attorney & Identification
            </label>
          </div>

          {/* IMAGE SAMPLE */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Illustration</p>
            <img
              src="/sample-licence.jpg"
              alt="sample"
              className="w-60 border rounded"
            />
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end">
            <button
              disabled={!file}
              className={`px-4 py-2 rounded text-white ${
                file
                  ? "bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}