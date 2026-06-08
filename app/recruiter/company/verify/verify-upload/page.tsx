"use client";

import { useState } from "react";
import "@/styles/company/BusinessCertificateForm.css";
import { useAuth } from "@/context/AuthContext";
import { uploadCertificate } from "@/services/companies/company.service";
import { useToast } from "@/components/notification/ToastProvider";

export default function BusinessCertificateForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const toast = useToast();
  const companyId = auth?.user?.companyId;
console.log(companyId);
  const handleFileChange = (e: any) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // Validate size (5MB)
    if (selected.size > 5 * 1024 * 1024) {
      toast.warning("File must be <= 5MB");
      return;
    }

    setFile(selected);

    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();

  if (!file || !companyId) return;

  try {
    setLoading(true);

    await uploadCertificate(file, companyId);

    toast.success("Uploaded successfully!");
    setFile(null);
    setPreview(null);

  } catch (err) {
    console.error(err);
    toast.error("Upload failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded">

      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center">
        <span className="font-semibold text-lg">
          Business Registration Certificate Information
        </span>
      </div>

      {/* BODY */}
      <div className="p-4">

        <p className="mb-4">
          Please choose your preferred upload method; see the upload instructions{" "}
          <a
            href="https://drive.google.com/file/d/1RSlBTKDRA2s6oRyNgfzAHdnnTyl2_j3g/view"
            target="_blank"
            className="text-green-600"
          >
            here
          </a>
        </p>

        {/* OPTION */}
        <div className="flex items-center gap-2 mb-4">
          <input type="radio" checked readOnly />
          <span className="font-semibold">
            Business registration certificate or other equivalent documents
          </span>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <div>
            <label className="font-medium">
              Documents <span className="text-red-500">*</span>
            </label>

            {/* UPLOAD BOX */}
            <div className="border border-dashed rounded p-6 mt-2 text-center">
              <p className="text-gray-500">Select or drag the file here.</p>
              <p className="text-sm text-gray-400">
                Maximum file size: 5MB, formats: jpeg, jpg, png, pdf
              </p>

              <input
                type="file"
                accept=".jpeg,.jpg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />

              <label
                htmlFor="fileUpload"
                className="inline-block mt-3 px-4 py-2 border rounded cursor-pointer text-green-600"
              >
                Select file
              </label>
            </div>

            {/* PREVIEW */}
            {preview && (
              <img src={preview} className="mt-4 w-64 border rounded" />
            )}

            {file && file.type === "application/pdf" && (
              <p className="mt-3 text-blue-600">{file.name}</p>
            )}

            {/* WARNING */}
            <div className="mt-4 bg-orange-100 p-3 rounded text-sm text-orange-700">
              <ul className="list-disc ml-5">
                <li>
                  The document must be complete, no editing or cutting.
                </li>
                <li>
                  Information must match Tax Department data.
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="illustration">
            <p className="font-medium mb-2">Illustration</p>
            <div className="illustration-sample-img">
              <img
                src="/images/sample-licence.jpg"
                className="w-full border rounded"
                alt="sample"
              />
            </div>

          </div>
        </div>

        {/* SECOND OPTION */}
        {/* <div className="flex items-center gap-2 mt-6">
          <input type="radio" />
          <span className="font-semibold">
            Power of Attorney and Identification Documents
          </span>
        </div> */}
      </div>

      {/* FOOTER */}
      <div className="flex justify-end p-4">
        <button
          type="submit"
          disabled={!file || loading}
          className={`px-6 py-2 rounded text-white ${file ? "bg-green-600" : "bg-gray-400"
            }`}
        >
          {loading ? "Uploading..." : "Save"}
        </button>
      </div>
    </form>
  );
}
