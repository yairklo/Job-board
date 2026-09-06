import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

// Pages
import Home from '../pages/Home';
import WhatsAppFeed from '../pages/WhatsAppFeed';
import JobDetails from '../pages/JobDetails';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SavedJobs from '../pages/SavedJobs';
import MyJobs from '../pages/MyJobs';
import CreateEditJob from '../pages/CreateEditJob';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
    <h1 className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h2>
    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
      The page you are looking for doesn't exist or has been moved.
    </p>
    <a href="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
      Go back home
    </a>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/whatsapp" element={<WhatsAppFeed />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />

        {/* Guest Only Routes */}
        <Route element={<ProtectedRoute requireGuest />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Authenticated Users */}
        <Route element={<ProtectedRoute requireAuth />}>
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Recruiters Only */}
        <Route element={<ProtectedRoute requireRecruiter />}>
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/jobs/create" element={<CreateEditJob />} />
        </Route>

        {/* Edit Jobs: Recruiter or Admin */}
        <Route element={<ProtectedRoute requireRecruiterOrAdmin />}>
          <Route path="/jobs/edit/:id" element={<CreateEditJob />} />
        </Route>

        {/* Admin Only */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
