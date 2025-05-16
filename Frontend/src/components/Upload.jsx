import React, { useRef } from "react";

export default function Upload({ onFileSelect, preview }) {
  const inputRef = useRef(null);

  const handleBrowse = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          onFileSelect(file, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBrowse();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleBrowse}
      onKeyDown={handleKeyDown}
      className="relative cursor-pointer p-6 flex flex-col items-center bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label={preview ? "Change avatar" : "Upload avatar"}
    >
      {preview ? (
        <motion.img
          src={preview}
          alt="avatar preview"
          className="w-24 h-24 rounded-full object-cover"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      ) : (
        <motion.div
          className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-12 h-12 text-gray-400"
            fill="currentColor"
          >
            <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.67v6h4V9h3.67L12 2z" />
          </svg>
        </motion.div>
      )}
      <p className="mt-3 text-sm text-gray-600">
        {preview ? "Change Avatar" : "Click to upload avatar"}
      </p>
      <input
        type="file"
        accept="image/*,.csv,.xlsx,.xls"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
