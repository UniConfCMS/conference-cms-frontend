
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DefaultLayout } from '../../components/DefaultLayout';
import { Conference } from '../../interfaces/Conference';
import { Page } from '../../interfaces/Page';
import { AuthContext } from '../../context/AuthContext';
import { DeletePageModal } from '../PageView/DeletePageModel'; 


export const DetailConferenceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [conference, setConference] = useState<Conference | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [selectedPageForDelete, setSelectedPageForDelete] = useState<Page | null>(null);
  const [isConferenceModalOpen, setIsConferenceModalOpen] = useState(false); // Стан для модального вікна конференції

  const canDeletePage = user?.role === 'admin' || user?.role === 'editor';
  const canDeleteConference = user?.role === 'admin';

  const fetchConferencePages = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Створюємо базові заголовки
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      // Додаємо авторизацію тільки якщо є токен
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(`http://localhost:8000/api/conferences/${id}/pages`, {
        method: 'GET',
        headers,
        credentials: token ? 'include' : 'omit',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: Page[] = await response.json();
      setPages(data);
  
      if (data.length > 0) {
        setSelectedPage(data[0]);
      }
  
      setError(null);
    } catch (err) {
      console.error('Error loading conference pages:', err);
      setError('Не вдалося завантажити сторінки конференції');
    } finally {
      setLoading(false);
    }
  };
  

  const fetchConferenceDetails = async (): Promise<void> => {
    try {
      // Створюємо базові заголовки
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      // Додаємо авторизацію тільки якщо є токен
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(`http://localhost:8000/api/conferences`, {
        method: 'GET',
        headers,
        credentials: token ? 'include' : 'omit',
      });
  
      if (response.ok) {
        const conferences: Conference[] = await response.json();
        const currentConference = conferences.find((conf: Conference) => conf.id === Number(id));
        setConference(currentConference || null);
      }
    } catch (err) {
      console.error('Error loading conference details:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConferencePages();
      fetchConferenceDetails();
    }
  }, [id, token]);

  const handlePageSelect = (page: Page): void => {
    setSelectedPage(page);
  };

  const openPageModal = (page: Page) => {
    setSelectedPageForDelete(page);
    setIsPageModalOpen(true);
  };

  const handleDeletePage = async (pageId: number) => {
    if (!canDeletePage) {
      console.error('Недостатньо прав для видалення сторінки');
      setError('Недостатньо прав для видалення сторінки');
      return;
    }

    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });

      const response = await fetch(`http://localhost:8000/api/admin/conferences/${id}/pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      setPages(pages.filter((page) => page.id !== pageId));
      if (selectedPage?.id === pageId) {
        setSelectedPage(pages[0] || null);
      }
      setIsPageModalOpen(false);
    } catch (error: any) {
      console.error('Помилка при видаленні сторінки:', error);
      setError(error.message || 'Не вдалося видалити сторінку');
    }
  };

  const openConferenceModal = () => {
    setIsConferenceModalOpen(true);
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
            <div className="text-xl text-red-500 mb-4">{error}</div>
            <button
              onClick={() => navigate('/conferences')}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
            >
              Back to conferences
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
            <h1 className="text-3xl font-bold text-white">
              {conference?.title || 'Conference'}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/conferences')}
                className="px-4 py-2 border rounded-lg text-white hover:bg-gray-700"
              >
                Back
              </button>
              {user && token && (
                <>
                  <button
                    onClick={() => navigate(`/conferences/${id}/create-page`)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                  >
                    Create Page
                  </button>
                  {canDeleteConference && (
                    <button
                      onClick={openConferenceModal}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                    >
                      Delete Conference
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="text-center py-10">
            <p className="text-gray-400">No pages available for this conference</p>
          </div>
        </main>
      </DefaultLayout>
    );
  }

  // Main page layout with content
  return (
    <DefaultLayout>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            {conference?.title || 'Conference Pages'}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/conferences')}
              className="px-4 py-2 border rounded-lg text-white hover:bg-gray-700"
            >
              Back
            </button>
            {user && token && selectedPage && (
              <>
                <button
                  onClick={() => navigate(`/conferences/${id}/edit-page/${selectedPage.id}`)}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors"
                >
                  Edit Page
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pages Menu */}
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
                    {canDeletePage && (
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
              {user && token && (
                <button
                  onClick={() => navigate(`/conferences/${id}/create-page`)}
                  className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                >
                  Add Page
                </button>
              )}
            </div>
          </div>

          {/* Selected Page Content */}
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

        {/* Page Deletion Modal */}
        <DeletePageModal
          isOpen={isPageModalOpen}
          onClose={() => setIsPageModalOpen(false)}
          page={selectedPageForDelete}
          onDelete={handleDeletePage}
          isDeleting={false}
          userRole={user?.role}
        />
      </main>
    </DefaultLayout>
  );