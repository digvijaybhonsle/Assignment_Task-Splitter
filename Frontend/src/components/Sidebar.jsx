import React, { useEffect, useState } from "react";
import { LayoutDashboard, Upload, Settings, UserPlus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [user, setUser] = useState({ name: null, avatar: null, email: null });
  const location = useLocation();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const avatar = localStorage.getItem("userAvatar");
    setUser({ name, avatar, email: "" });
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { label: "Upload List", icon: <Upload size={20} />, href: "/upload" },
    { label: "Add Agent", icon: <UserPlus size={20} />, href: "/agents/new" },
    { label: "Manage Agent", icon: <Settings size={20} />, href: "/agents" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-white shadow-lg px-6 py-8 flex-col border-r border-gray-200"
      >
        <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
          Task Splitter
        </h2>
        <hr className="mb-6" />

        <nav className="flex flex-col space-y-4 flex-1">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.href;
            return (
              <a
                key={idx}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-2 rounded-md font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-2 p-4 bg-gray-300 rounded-lg">
          <img
            src={
              user.avatar
                ? user.avatar
                : "https://ui-avatars.com/api/?name=User&background=ccc"
            }
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800">
              {user.name || "Guest"}
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Bottom Nav */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="md:hidden fixed bottom-0 inset-x-0 bg-white shadow-t flex justify-around items-center py-2 border-t border-gray-200"
      >
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.href;
          return (
            <a
              key={idx}
              href={item.href}
              className={`flex flex-col items-center text-xs transition-colors ${
                isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {React.cloneElement(item.icon, { size: 24 })}
              <span>{item.label}</span>
            </a>
          );
        })}
      </motion.nav>
    </>
  );
};

export default Sidebar;
