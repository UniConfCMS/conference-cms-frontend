import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Page } from '../../interfaces/Page';
import axios from 'axios';

interface ConferencePagesProps {
  conferenceId: number;
  onClose: () => void;
}

const ConferencePages: React.FC<ConferencePagesProps> = ({ conferenceId, onClose }) => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const canManagePages = user?.role === 'admin' || user?.role === 'editor';

  const fetchCsrfToken = async (): Promise<void> => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });
    } catch (err: any) {
      console.error('Error fetching CSRF token:', err);
    }
  };

  const fetchPages = async () => {
    if (!token) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8000/api/conferences/${conferenceId}/pages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        withCredentials: true,
      });
      setPages(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [conferenceId, token]);

  const handleDeletePage = async (pageId: number) => {
    if (!canManagePages) {
      setError('Insufficient permissions to delete pages');
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      await fetchCsrfToken();
      await axios.delete(`http://localhost:8000/api/admin/conferences/${conferenceId}/pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        withCredentials: true,
      });
      setPages(pages.filter((page) => page.id !== pageId));
      setSuccess('Page deleted successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete page');
    }
  };

  const handleEditPage = (pageId: number) => {
    if (!canManagePages) {
      setError('Insufficient permissions to edit pages');
      return;
    }
    navigate(`/conferences/${conferenceId}/edit-page/${pageId}`);
  };

  const handleCreatePage = () => {
    if (!canManagePages) {
      setError('Insufficient permissions to create pages');
      return;
    }
    navigate(`/conferences/${conferenceId}/create-page`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Conference Pages</h2>
          {canManagePages && (
            <button
              onClick={handleCreatePage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Create Page
            </button>
          )}
        </div>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {success && <p className="text-green-400 mb-4">{success}</p>}
        {isLoading ? (
          <div className="flex items-center space-x-3 mb-4">
            <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-gray-300">Loading...</span>
          </div>
        ) : (
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created By</th>
                  {canManagePages && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan={canManagePages ? 3 : 2} className="px-6 py-4 text-center text-sm text-gray-100">
                      No pages found
                    </td>
                  </tr>
                ) : (
                  pages.map((page) => (
                    <tr key={page.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{page.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{page.created_by}</td>
                      {canManagePages && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditPage(page.id)}
                            className="text-indigo-400 hover:text-indigo-600 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePage(page.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConferencePages;