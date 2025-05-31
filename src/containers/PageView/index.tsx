import React, { useState, useEffect } from 'react';
import { Page } from '../../interfaces/Page';

interface ConferencePageProps {
  conferenceId: string; // ID конференції для фетчу сторінок
}

export const ConferencePage: React.FC<ConferencePageProps> = ({ conferenceId }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Фетч сторінок із API
  const fetchPages = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/conferences/${conferenceId}/pages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data: Page[] = await response.json();
      console.log('Fetched pages:', data); // Лог для діагностики
      setPages(data);
      if (data.length > 0) {
        setSelectedPage(data[0]); // Встановлюємо першу сторінку за замовчуванням
      }
      setError(null);
    } catch (err) {
      console.error('Error loading conference pages:', err);
      setError('Failed to load conference pages');
    } finally {
      setLoading(false);
    }
  };

  // Викликаємо фетч при зміні conferenceId
  useEffect(() => {
    if (conferenceId) {
      fetchPages();
    }
  }, [conferenceId]);

  // Обробник вибору сторінки
  const handlePageSelect = (page: Page): void => {
    setSelectedPage(page);
  };

  if (loading) {
    return (
      <div className="bg-[#1a1a26] rounded-lg p-6">
        <p className="text-gray-400">Loading pages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1a26] rounded-lg p-6">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchPages}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Pages Menu */}
      <div className="lg:w-1/4">
        <div className="bg-[#1a1a26] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Pages</h3>
          {pages.length === 0 ? (
            <p className="text-gray-400">No pages found for this conference</p>
          ) : (
            <nav className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageSelect(page)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedPage?.id === page.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {page.title}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Selected Page Content */}
      <div className="lg:w-3/4">
        {selectedPage ? (
          <div className="bg-[#1a1a26] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">{selectedPage.title}</h2>
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
            <p className="text-gray-400">Select a page to view content</p>
          </div>
        )}
      </div>
    </div>
  );
};