// src/layouts/MainLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
