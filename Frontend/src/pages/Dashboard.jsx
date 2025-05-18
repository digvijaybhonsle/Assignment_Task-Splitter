import React, { useState, useEffect } from "react";
import DistributedList from "../components/DistributedList";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(`${API_URL}/api/lists`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        });

        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch distribution data:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError("Unauthorized. Please log in again.");
          } else {
            setError(
              err.response
                ? `Error ${err.response.status}: ${err.response.statusText}`
                : err.message
            );
          }
        } else {
          setError(err.message || "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");

      toast.success("Logged out successfully!", { position: "top-center", duration: 2000 });
      setTimeout(() => navigate("/auth"), 2000);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.", { position: "top-center", duration: 2000 });
    }
  };

  const handleUploadClick = () => navigate("/upload");

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Global Toaster */}
      <Toaster
        position="top-center"
        toastOptions={{
          success: { position: "top-center" },
          error: { position: "top-center" }
        }}
      />

      <main className="flex-1 w-full px-4 py-6 sm:px-6 md:px-8 overflow-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-indigo-600"
          >
            Dashboard
          </motion.h1>

          <div className="flex flex-1 items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUploadClick}
              className="bg-indigo-600 text-white px-5 py-2 text-sm sm:text-base rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Upload List
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2 text-sm sm:text-base rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Logout
            </motion.button>
          </div>
        </div>

        <hr className="my-6" />

        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Distributed List
        </h2>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading distribution...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">Error: {error}</div>
        ) : (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <DistributedList data={data} />
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
