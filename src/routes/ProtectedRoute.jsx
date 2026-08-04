import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ requireAuth = false, requireGuest = false, requireRecruiter = false, requireAdmin = false, requireRecruiterOrAdmin = false }) => {
  const { isLoggedIn, isRecruiter, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (requireGuest && isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requireRecruiter && !isRecruiter) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireRecruiterOrAdmin && !isRecruiter && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
