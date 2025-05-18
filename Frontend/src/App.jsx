import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import { Toaster } from "react-hot-toast";
import AddAgent from './components/AddAgent';
import MainLayout from './layouts/MainLayout';
import AgentManager from './pages/AgentManager';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/agents/new" element={<AddAgent />} />
          <Route path="/agents" element={<AgentManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
