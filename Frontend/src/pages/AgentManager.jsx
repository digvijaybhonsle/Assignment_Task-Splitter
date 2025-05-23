import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const AgentManager = () => {
  const [agents, setAgents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/agents`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setAgents(res.data);
    } catch (err) {
      console.error("Fetch agents error:", err);
      toast.error("Failed to load agents", { position: "top-center", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleEdit = (agent) => {
    setEditingId(agent._id);
    setFormData({ name: agent.name, email: agent.email, mobile: agent.mobile });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", mobile: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (id) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/agents/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setAgents((prev) => prev.map((a) => (a._id === id ? res.data : a)));
      handleCancel();
      toast.success("Agent updated successfully", { position: "top-center", duration: 2000 });
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update agent", { position: "top-center", duration: 3000 });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      await axios.delete(`${API_URL}/api/agents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setAgents((prev) => prev.filter((agent) => agent._id !== id));
      toast.success("Agent deleted successfully", { position: "top-center", duration: 2000 });
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete agent", { position: "top-center", duration: 3000 });
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Toaster
        position="top-center"
        toastOptions={{
          success: { position: "top-center" },
          error: { position: "top-center" }
        }}
      />
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-700">
        Agent Management
      </h2>
      <hr className="mb-6" />

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading agents...
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => (
            <motion.div
              key={agent._id}
              className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {editingId === agent._id ? (
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 flex-1 min-w-0">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 text-sm rounded w-full sm:w-[160px]"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 text-sm rounded w-full sm:w-[220px]"
                  />
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="border p-2 text-sm rounded w-full sm:w-[160px]"
                  />
                </div>
              ) : (
                <div className="flex-1 min-w-0 space-y-1 text-sm">
                  <p><strong>Name:</strong> {agent.name}</p>
                  <p><strong>Email:</strong> {agent.email}</p>
                  <p><strong>Mobile:</strong> {agent.mobile}</p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap justify-end sm:justify-center">
                {editingId === agent._id ? (
                  <>
                    <button
                      onClick={() => handleSave(agent._id)}
                      className="bg-green-500 text-white px-4 py-2 text-sm rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-400 text-white px-4 py-2 text-sm rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(agent)}
                      className="bg-yellow-500 text-white px-4 py-2 text-sm rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(agent._id)}
                      className="bg-red-600 text-white px-4 py-2 text-sm rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentManager;
