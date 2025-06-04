import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Editor } from '../../interfaces/Editros';
import { User } from '../../interfaces/User';
import axios from 'axios';

interface ConferenceEditorsProps {
  conferenceId: number;
  onClose: () => void;
}

const ConferenceEditors: React.FC<ConferenceEditorsProps> = ({ conferenceId, onClose }) => {
  const { token } = useContext(AuthContext);
  const [editors, setEditors] = useState<Editor[]>([]);
  const [availableEditors, setAvailableEditors] = useState<User[]>([]);
  const [selectedEditorId, setSelectedEditorId] = useState<number | null>(null);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCsrfToken = async (): Promise<boolean> => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });
      return true;
    } catch (err: any) {
      console.error('Error fetching CSRF token:', err);
      setError('Failed to fetch CSRF token');
      return false;
    }
  };

  const fetchData = async () => {
    if (!token) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const [editorsResponse, availableEditorsResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/admin/conferences/${conferenceId}/editors`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          withCredentials: true,
        }),
        axios.get('http://localhost:8000/api/users/editors', {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          withCredentials: true,
        }),
      ]);

      if (!Array.isArray(editorsResponse.data)) {
        throw new Error('Invalid editors data format');
      }

      setEditors(editorsResponse.data);
      setAvailableEditors(
        availableEditorsResponse.data.filter(
          (user: User) =>
            user.id &&
            !editorsResponse.data.some((editor: Editor) => editor.user?.id === user.id)
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch editors');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 

    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, [conferenceId, token]);

  const handleAssignEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEditorId) {
      setError('Please select an editor');
      return;
    }
    setError(null);
    setSuccess(null);
    setIsAssigning(true);
    try {
      const csrfSuccess = await fetchCsrfToken();
      if (!csrfSuccess) return;
      const response = await axios.post(
        'http://localhost:8000/api/admin/editors/assign',
        { user_id: selectedEditorId, conference_id: conferenceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      );
      setSuccess('Editor assigned successfully');
      setSelectedEditorId(null);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign editor');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDeleteEditor = async (editorId: string) => {
    setError(null);
    setSuccess(null);
    try {
      const csrfSuccess = await fetchCsrfToken();
      if (!csrfSuccess) return;
      await axios.delete(`http://localhost:8000/api/admin/editors/${editorId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        withCredentials: true,
      });
      setSuccess('Editor removed successfully');
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove editor');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Conference Editors</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {success && <p className="text-green-400 mb-4">{success}</p>}
        {isLoading ? (
          <div className="flex items-center space-x-3 mb-4">
            <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"
              />
            </svg>
            <span className="text-gray-300">Loading...</span>
          </div>
        ) : (
          <>
            <form onSubmit={handleAssignEditor} className="mb-6">
              <div className="flex items-center space-x-4">
                <select
                  value={selectedEditorId || ''}
                  onChange={(e) => setSelectedEditorId(Number(e.target.value) || null)}
                  className="block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isAssigning || availableEditors.length === 0}
                >
                  <option value="">Select an editor</option>
                  {availableEditors.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={isAssigning || !selectedEditorId}
                >
                  {isAssigning ? 'Assigning...' : 'Assign Editor'}
                </button>
              </div>
            </form>

            <div className="bg-gray-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {editors.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-100">
                        No editors assigned
                      </td>
                    </tr>
                  ) : (
                    editors
                      .filter((editor) => editor.editor_id && editor.user)
                      .map((editor) => (
                        <tr key={editor.editor_id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                            {editor.user?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                            {editor.user?.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteEditor(editor.editor_id)}
                              className="text-red-400 hover:text-red-600"
                              disabled={!editor.user}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </>
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

export default ConferenceEditors;