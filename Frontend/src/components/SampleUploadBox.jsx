import React, { useCallback } from "react";

const SimpleUploadBox = ({ onFileSelect }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    onFileSelect(file, previewUrl);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    onFileSelect(file, previewUrl);
  }, [onFileSelect]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-400 w-full max-w-md p-6 text-center rounded-lg bg-white hover:border-indigo-500 transition"
    >
      <label htmlFor="file-upload" className="cursor-pointer block text-gray-600">
        <p className="text-lg mb-2">Drag & drop file here</p>
        <p className="text-sm text-gray-400 mb-4">or click to select file</p>
        <div className="bg-indigo-100 text-indigo-600 font-semibold px-4 py-2 inline-block rounded">
          Choose File
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default SimpleUploadBox;
