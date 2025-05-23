import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Base API URL from env
const API_URL = import.meta.env.VITE_API_URL || "";

export default function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setFormData({ name: "", email: "", password: "" });
    toast.dismiss();
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/signin";
    try {
      const { data } = await axios.post(
        `${API_URL}${endpoint}`,
        isRegistering
          ? formData
          : { email: formData.email, password: formData.password },
        { withCredentials: true }
      );

      console.log("Auth response:", data);
      const successText = data.message
        || (isRegistering
          ? "Registered successfully! Please sign in."
          : "Signed in successfully!");

      toast.success(successText, { position: "top-center", duration: 2000 });

      if (!isRegistering && data.token) {
        setTimeout(() => {
          localStorage.clear();
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userId", data.user?._id || data.user?.id || "");
          navigate("/dashboard");
        }, 2000);
      } else if (isRegistering) {
        setTimeout(() => {
          setIsRegistering(false);
          setFormData({ name: "", email: "", password: "" });
        }, 2000);
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errMsg =
        err.response?.data?.message
        || err.message
        || "Authentication failed";
      toast.error(errMsg, { position: "top-center", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-100">
      <Toaster
        position="top-center"
        toastOptions={{
          success: { position: "top-center" },
          error: { position: "top-center" }
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 bg-white rounded-xl shadow-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">
          {isRegistering
            ? "Sign up to get started"
            : "Please sign in to continue."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {isRegistering && (
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
                name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm sm:text-base"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition duration-200 disabled:opacity-50 text-sm sm:text-base"
          >
            {loading
              ? isRegistering
                ? "Registering..."
                : "Signing In..."
              : isRegistering
              ? "Register"
              : "Sign In"}
          </motion.button>
        </form>

        <p className="text-xs sm:text-sm text-center text-gray-600 mt-4">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-indigo-500 hover:underline font-medium"
          >
            {isRegistering ? "Sign In" : "Register"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
