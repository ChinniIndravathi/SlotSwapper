import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import RequestsPage from './pages/Requests';
import { useAuth } from './context/AuthContext';

function Protected({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <Protected>
          <Dashboard />
        </Protected>
      } />
      <Route path="/marketplace" element={
        <Protected>
          <Marketplace />
        </Protected>
      } />
      <Route path="/requests" element={
        <Protected>
          <RequestsPage />
        </Protected>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
