import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import Users from './UserAdminView';
import Conferences from './ConfernceAdminView';

const AdminPanel: React.FC = () => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center pt-20">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-7 w-7 text-indigo-400" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path
              fill="currentColor"
              d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"
              className="opacity-75"
            />
          </svg>
          <span className="text-gray-200 text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if no user or insufficient permissions
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is super_admin
  const isSuperAdmin = user.role === 'super_admin';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-indigo-400 transition-colors duration-200"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Panel</h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-8">
          <nav className="flex space-x-4">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              Users
            </NavLink>
            {/* Show Conferences tab only for admin */}
            {!isSuperAdmin && (
              <NavLink
                to="/admin/conferences"
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                Conferences
              </NavLink>
            )}
          </nav>
        </div>

        {/* Sub-routes */}
        <Routes>
          <Route path="users" element={<Users />} />
          {/* Allow Conferences route only for admin */}
          {!isSuperAdmin && <Route path="conferences" element={<Conferences />} />}
          <Route index element={<Navigate to="users" replace />} />
          <Route path="*" element={<Navigate to="users" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;