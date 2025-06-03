import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DefaultLayout } from '../../components/DefaultLayout';
import { Conference } from '../../interfaces/Conference';
import { Page } from '../../interfaces/Page';
import { AuthContext } from '../../context/AuthContext';
import { DeletePageModal } from '../PageView/DeletePageModel';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface EditorRecord {
  editor_id: number;
  user: User;
}

interface AddEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  allEditors: User[];
  assignedEditors: EditorRecord[];
  onAddEditor: (userId: number) => void;
  onRemoveEditor: (editorId: number) => void;
}

const AddEditorModal: React.FC<AddEditorModalProps> = ({ isOpen, onClose, allEditors, assignedEditors, onAddEditor, onRemoveEditor }) => {
  if (!isOpen) return null;

  const assignedEditorUserIds = assignedEditors.map((e) => e.user.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a26] p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">Manage Editors</h2>
        {allEditors.length === 0 ? (
          <p className="text-gray-400">No editors available</p>
        ) : (
          <ul className="space-y-2">
            {allEditors.map((editor) => (
              <li key={editor.id} className="flex justify-between items-center">
                <span className="text-gray-300">{editor.name} ({editor.email})</span>
                {assignedEditorUserIds.includes(editor.id) ? (
                  <button
                    onClick={() => {
                      const editorRecord = assignedEditors.find((e) => e.user.id === editor.id);
                      if (editorRecord) onRemoveEditor(editorRecord.editor_id);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => onAddEditor(editor.id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
                  >
                    Add
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const DetailConferenceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [conference, setConference] = useState<Conference | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editors, setEditors] = useState<EditorRecord[]>([]);
  const [availableEditors, setAvailableEditors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [selectedPageForDelete, setSelectedPageForDelete] = useState<Page | null>(null);
  const [isConferenceModalOpen, setIsConferenceModalOpen] = useState(false);
  const [isEditorForConference, setIsEditorForConference] = useState<boolean>(false);

  const isAdmin = user?.role === 'admin';
  const canManagePages = isAdmin || isEditorForConference;
  const canDeleteConference = isAdmin;

  const fetchCsrfToken = async (): Promise<void> => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });
    } catch (err: any) {
      console.error('Error fetching CSRF token:', err);
    }
  };

  const fetchEditorStatus = async (): Promise<void> => {
    if (!user || !token || user.role !== 'editor') {
      setIsEditorForConference(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/editors/check/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      setIsEditorForConference(response.data.isEditor);
    } catch (err: any) {
      console.error('Error checking editor status:', err);
      setIsEditorForConference(false);
    }
  };

  const fetchConferencePages = async (): Promise<void> => {
    try {
      setLoading(true);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(`http://localhost:8000/api/conferences/${id}/pages`, {
        headers,
        withCredentials: token ? true : false,
      });

      setPages(response.data);

      if (response.data.length > 0) {
        setSelectedPage(response.data[0]);
      }

      setError(null);
    } catch (err: any) {
      console.error('Error loading conference pages:', err);
      setError(err.response?.data?.message || 'Failed to load conference pages');
    } finally {
      setLoading(false);
    }
  };

  const fetchConferenceDetails = async (): Promise<void> => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(`http://localhost:8000/api/conferences`, {
        headers,
        withCredentials: token ? true : false,
      });

      const conferences: Conference[] = response.data;
      const currentConference = conferences.find((conf: Conference) => conf.id === Number(id));
      setConference(currentConference || null);
    } catch (err: any) {
      console.error('Error loading conference:', err);
    }
  };

  const fetchEditors = async (): Promise<void> => {
    if (!isAdmin || !token) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/admin/conferences/${id}/editors`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      const validEditors = response.data.filter((editor: EditorRecord) => editor.user && editor.user.name);
      setEditors(validEditors);
    } catch (err: any) {
      console.error('Error loading editors:', err);
      setError(err.response?.data?.message || 'Failed to load editors');
    }
  };

  const fetchAvailableEditors = async (): Promise<void> => {
    if (!isAdmin || !token) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/users/editors`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      const validEditors = response.data.filter((editor: User) => editor && editor.name);
      setAvailableEditors(validEditors);
    } catch (err: any) {
      console.error('Error loading available editors:', err);
      setError(err.response?.data?.message || 'Failed to load available editors');
    }
  };

  const handleAddEditor = async (userId: number) => {
    if (!isAdmin || !token) return;

    try {
      await fetchCsrfToken();

      await axios.post(
        `http://localhost:8000/api/admin/editors/assign`,
        {
          user_id: userId,
          conference_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );

      await fetchEditors();
      setIsEditorModalOpen(false);
    } catch (err: any) {
      console.error('Error adding editor:', err);
      setError(err.response?.data?.message || 'Failed to add editor');
    }
  };

  const handleRemoveEditor = async (editorRecordId: number) => {
    if (!isAdmin || !token) return;

    try {
      await fetchCsrfToken();

      await axios.delete(`http://localhost:8000/api/admin/editors/${editorRecordId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      await fetchEditors();
      setIsEditorModalOpen(false);
    } catch (err: any) {
      console.error('Error removing editor:', err);
      setError(err.response?.data?.message || 'Failed to remove editor');
    }
  };

  const handleDeletePage = async (pageId: number) => {
    if (!canManagePages) {
      setError('Insufficient permissions to delete page');
      return;
    }

    try {
      await fetchCsrfToken();

      await axios.delete(`http://localhost:8000/api/admin/conferences/${id}/pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      setPages(pages.filter((page) => page.id !== pageId));
      if (selectedPage?.id === pageId) {
        setSelectedPage(pages[0] || null);
      }
      setIsPageModalOpen(false);
    } catch (err: any) {
      console.error('Error deleting page:', err);
      setError(err.response?.data?.message || 'Failed to delete page');
    }
  };

  useEffect(() => {
    if (id) {
      if (isAdmin) {
        fetchEditors();
        fetchAvailableEditors();
      }
      fetchConferencePages();
      fetchConferenceDetails();
      fetchEditorStatus();
    }
  }, [id, token, user, isAdmin]);

  const handlePageSelect = (page: Page): void => {
    setSelectedPage(page);
  };

  const openPageModal = (page: Page) => {
    setSelectedPageForDelete(page);
    setIsPageModalOpen(true);
  };

  const openConferenceModal = () => {
    setIsConferenceModalOpen(true);
  };

  const openEditorModal = () => {
    setIsEditorModalOpen(true);
  };

  if (loading) {
    return (
      <DefaultLayout>
        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-white">Loading conference pages...</div>
          </div>
        </main>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-xl text-red-400 mb-4">{error}</div>
            <button
              onClick={() => navigate('/conferences')}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
            >
              Back to Conferences
            </button>
          </div>
        </main>
      </DefaultLayout>
    );
  }

  if (pages.length === 0) {
    return (
      <DefaultLayout>
        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {conference?.title || 'Conference'}
              </h1>
              {isAdmin && (
                <div className="text-sm text-gray-400 mt-1">
                  {editors.length > 0 ? (
                    <button onClick={openEditorModal} className="underline hover:text-gray-200">
                      Editors: {editors.map((e) => e.user.name).join(', ')}
                    </button>
                  ) : (
                    <button
                      onClick={openEditorModal}
                      className="underline hover:text-gray-200"
                    >
                      No editors, add one
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/conferences')}
                className="px-4 py-2 border rounded-lg text-white hover:bg-gray-700"
              >
                Back
              </button>
              {user && token && canManagePages && (
                <button
                  onClick={() => navigate(`/conferences/${id}/create-page`)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                >
                  Create Page
                </button>
              )}
              {canDeleteConference && (
                <button
                  onClick={openConferenceModal}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  Delete Conference
                </button>
              )}
            </div>
          </div>
          <div className="text-center py-10">
            <p className="text-gray-400">No pages available for this conference</p>
          </div>
          <AddEditorModal
            isOpen={isEditorModalOpen}
            onClose={() => setIsEditorModalOpen(false)}
            allEditors={availableEditors}
            assignedEditors={editors}
            onAddEditor={handleAddEditor}
            onRemoveEditor={handleRemoveEditor}
          />
        </main>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <main className="max-w-6xl mx-auto px-6 py-9">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {conference?.title || 'Conference Pages'}
            </h1>
            {isAdmin && (
              <div className="text-sm text-gray-400 mt-1">
                {editors.length > 0 ? (
                  <button onClick={openEditorModal} className="underline hover:text-gray-200">
                    Editors: {editors.map((e) => e.user.name).join(', ')}
                  </button>
                ) : (
                  <button
                    onClick={openEditorModal}
                    className="underline hover:text-gray-200"
                  >
                    No editors, add one
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/conferences')}
              className="px-4 py-2 border rounded-lg text-white hover:bg-gray-700"
            >
              Back
            </button>
            {user && token && selectedPage && canManagePages && (
              <button
                onClick={() => navigate(`/conferences/${id}/edit-page/${selectedPage.id}`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
              >
                Edit Page
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a26] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Pages</h3>
              <nav className="space-y-2 flex-1">
                {pages.map((page: Page) => (
                  <div key={page.id} className="flex items-center justify-between">
                    <button
                      onClick={() => handlePageSelect(page)}
                      className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedPage?.id === page.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {page.title}
                    </button>
                    {canManagePages && (
                      <button
                        onClick={() => openPageModal(page)}
                        className="px-0 py-1 text-sm font-medium text-white bg-red-600 border border-red-500 rounded-md hover:bg-red-700 transition-colors"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </nav>
              {user && token && canManagePages && (
                <button
                  onClick={() => navigate(`/conferences/${id}/create-page`)}
                  className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                >
                  Add Page
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedPage ? (
              <div className="bg-[#1a1a26] rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedPage.title}
                </h2>
                {selectedPage.created_at && (
                  <time className="block mb-6 text-gray-400 text-sm">
                    {new Date(selectedPage.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                )}
                <div
                  className="text-gray-300 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedPage.content }}
                />
              </div>
            ) : (
              <div className="bg-[#1a1a26] rounded-lg p-6">
                <p className="text-gray-400">Select a page to view its content</p>
              </div>
            )}
          </div>
        </div>

        <DeletePageModal
          isOpen={isPageModalOpen}
          onClose={() => setIsPageModalOpen(false)}
          page={selectedPageForDelete}
          onDelete={handleDeletePage}
          isDeleting={false}
          userRole={user?.role}
        />
        <AddEditorModal
          isOpen={isEditorModalOpen}
          onClose={() => setIsEditorModalOpen(false)}
          allEditors={availableEditors}
          assignedEditors={editors}
          onAddEditor={handleAddEditor}
          onRemoveEditor={handleRemoveEditor}
        />
      </main>
    </DefaultLayout>
  );
};