import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddAgent() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || '';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `${API_URL}/api/agents`,
        form,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setMsg({ type: 'success', text: res.data.message || 'Agent created!' });
      setForm({ name: '', email: '', mobile: '', password: '' });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10"
      >
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Add New Agent
        </h3>

        {msg && (
          <div className={`mb-6 px-4 py-2 rounded-md text-center text-sm font-medium ${
            msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          {[
            { id: 'name', type: 'text', label: 'Name' },
            { id: 'email', type: 'email', label: 'Email' },
            { id: 'mobile', type: 'tel', label: 'Mobile Number', placeholder: '+1 234 567 8901' },
            { id: 'password', type: 'password', label: 'Password', minLength: 6 }
          ].map((field) => (
            <div key={field.id} className="flex flex-col">
              <label htmlFor={field.id} className="text-gray-700 mb-2">{field.label}</label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                value={form[field.id]}
                onChange={handleChange}
                required
                minLength={field.minLength}
                placeholder={field.placeholder || ''}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 transition"
          >
            Create Agent
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
