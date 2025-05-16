import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Base API URL from env
const API_URL = import.meta.env.VITE_API_URL || "";

export default function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setFormData({ name: "", email: "", password: "" });
    setMessage(null);
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/signin";

    try {
      const { data } = await axios.post(
        `${API_URL}${endpoint}`,
        isRegistering
          ? formData
          : { email: formData.email, password: formData.password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setMessage({ type: "success", text: data.message });

      if (!isRegistering && data.token) {
        localStorage.clear();
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user?._id || data.user?.id || "");
        navigate("/dashboard");
      } else if (isRegistering) {
        setIsRegistering(false);
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      console.error("Auth error:", err);
      const msg =
        err.response?.data?.message || err.message || "Authentication failed";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-100">
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

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {isRegistering && (
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="John Doe"
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
              value={formData.email}
              placeholder="Email"
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
              value={formData.password}
              placeholder="Password"
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
