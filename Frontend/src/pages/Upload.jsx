import React, { useState } from "react";
import SimpleUploadBox from "../components/SampleUploadBox";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const allowedTypes = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const validateAndSetFile = (file) => {
    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      toast.error("Only CSV, XLSX, and XLS files are allowed");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a valid file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/lists/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Upload successful!");
        setSelectedFile(null);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-3 text-center"
        >
          Upload Task File
        </motion.h1>
        <p className="text-gray-600 mb-8 max-w-md text-center text-sm sm:text-base px-4">
          Click below to upload a <strong>.csv</strong>, <strong>.xlsx</strong>,
          or <strong>.xls</strong> file containing the task data to be
          distributed among agents.
        </p>

        {/* Upload Box */}
        <div className="w-full max-w-md">
          <SimpleUploadBox onFileSelect={validateAndSetFile} />
        </div>

        {/* Selected file name */}
        {selectedFile && (
          <p className="mt-4 text-gray-700 font-medium text-center truncate max-w-md px-4">
            {selectedFile.name}
          </p>
        )}

        {/* Upload Button */}
        <div className="mt-8">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-8 rounded-lg transition duration-200 disabled:opacity-50 block mx-auto"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </main>
    </div>
  );
}
