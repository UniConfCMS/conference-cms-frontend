import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Conference } from '../../interfaces/Conference';
import axios from 'axios';
import ConferencePages from './ConferencePagesView';
import ConferenceEditors from './ConferenceEditorsView';

const Conferences: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newConference, setNewConference] = useState<Omit<Conference, 'id'>>({
    title: '',
    year: 0,
    created_by: 0, // Set by backend
    created_at: '', // Set by backend
    updated_at: '', // Set by backend
    creator: undefined, // Optional
    pages: undefined, // Optional
  });
  const [editConference, setEditConference] = useState<Conference | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPagesForConference, setShowPagesForConference] = useState<number | null>(null);
  const [showEditorsForConference, setShowEditorsForConference] = useState<number | null>(null);

  const fetchCsrfToken = async (): Promise<void> => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });
    } catch (err: any) {
      console.error('Error fetching CSRF token:', err);
    }
  };

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/conferences', {
          headers: { Accept: 'application/json' },
          withCredentials: true,
        });
        setConferences(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch conferences');
      } finally {
        setIsLoading(false);
      }
    };
    fetchConferences();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await fetchCsrfToken();
      const response = await axios.post(
        'http://localhost:8000/api/admin/conferences',
        {
          title: newConference.title,
          year: newConference.year,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      );
      setConferences([...conferences, response.data]);
      setSuccess('Conference created successfully!');
      setIsCreateModalOpen(false);
      setNewConference({
        title: '',
        year: 0,
        created_by: 0,
        created_at: '',
        updated_at: '',
        creator: undefined,
        pages: undefined,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create conference');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editConference) return;
    setError(null);
    setSuccess(null);
    try {
      await fetchCsrfToken();
      const response = await axios.put(
        `http://localhost:8000/api/admin/conferences/${editConference.id}`,
        {
          title: editConference.title,
          year: editConference.year,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      );
      setConferences(conferences.map((c) => (c.id === editConference.id ? response.data.conference : c)));
      setSuccess('Conference updated successfully!');
      setIsEditModalOpen(false);
      setEditConference(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update conference');
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await fetchCsrfToken();
      await axios.delete(`http://localhost:8000/api/admin/conferences/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        withCredentials: true,
      });
      setConferences(conferences.filter((c) => c.id !== id));
      setSuccess('Conference deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete conference');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Conferences</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Create Conference
        </button>
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
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {conferences.map((conf) => (
                <tr key={conf.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{conf.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{conf.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setEditConference(conf);
                        setIsEditModalOpen(true);
                      }}
                      className="text-indigo-400 hover:text-indigo-600 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(conf.id)}
                      className="text-red-400 hover:text-red-600 mr-4"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowPagesForConference(conf.id)}
                      className="text-green-400 hover:text-green-600 mr-4"
                    >
                      Show Pages
                    </button>
                    <button
                      onClick={() => setShowEditorsForConference(conf.id)}
                      className="text-yellow-400 hover:text-yellow-600"
                    >
                      Show Editors
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Create Conference</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            {success && <p className="text-green-400 mb-4">{success}</p>}
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newConference.title}
                  onChange={(e) => setNewConference({ ...newConference, title: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter title"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="year" className="block text-sm font-medium text-gray-300">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  value={newConference.year || ''}
                  onChange={(e) => setNewConference({ ...newConference, year: parseInt(e.target.value) })}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter year"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editConference && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Conference</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            {success && <p className="text-green-400 mb-4">{success}</p>}
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={editConference.title}
                  onChange={(e) => setEditConference({ ...editConference, title: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter title"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="year" className="block text-sm font-medium text-gray-300">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  value={editConference.year}
                  onChange={(e) => setEditConference({ ...editConference, year: parseInt(e.target.value) })}
                  className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter year"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPagesForConference && (
        <ConferencePages
          conferenceId={showPagesForConference}
          onClose={() => setShowPagesForConference(null)}
        />
      )}

      {showEditorsForConference && (
        <ConferenceEditors
          conferenceId={showEditorsForConference}
          onClose={() => setShowEditorsForConference(null)}
        />
      )}
    </div>
  );
};

export default Conferences;