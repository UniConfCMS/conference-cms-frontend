import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DefaultLayout } from "../../components/DefaultLayout";
import { Conference} from "../../interfaces/Conference";
import { Page } from "../../interfaces/Page";

export const DetailConferenceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [conference, setConference] = useState<Conference | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch conference pages
  const fetchConferencePages = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/conferences/${id}/pages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Page[] = await response.json();
      setPages(data);
      
      // Set first page as selected by default
      if (data.length > 0) {
        setSelectedPage(data[0]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading conference pages:', err);
      setError('Failed to load conference pages');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch conference details
  const fetchConferenceDetails = async (): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8000/api/conferences`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
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

  // Load data on component mount
  useEffect(() => {
    if (id) {
      fetchConferencePages();
      fetchConferenceDetails();
    }
  }, [id]);

  // Handle page selection
  const handlePageSelect = (page: Page): void => {
    setSelectedPage(page);
  };

  // Show loading state
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

  // Show error state
  if (error) {
    return (
      <DefaultLayout>
        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-xl text-red-500 mb-4">{error}</div>
            <button
              onClick={() => navigate("/newspaper")}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
            >
              Back to conferences
            </button>
          </div>
        </main>
      </DefaultLayout>
    );
  }

  // Show empty state
  if (pages.length === 0) {
    return (
      <DefaultLayout>
        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">
              {conference?.title || 'Conference'}
            </h1>
            <button
              onClick={() => navigate("/newspaper")}
              className="px-4 py-2 border rounded-lg text-white hover:bg-gray-700"
            >
              Back
            </button>
          </div>
          <div className="text-center py-10">
            <p className="text-gray-400">No pages found for this conference</p>
          </div>
        </main>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            {conference?.title || 'Conference Pages'}
          </h1>
          <button
            onClick={() => navigate("/newspaper")}
            className="px-4 py-2 border rounded-lg text-white hover:bg-gray-700"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pages Menu */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a26] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Pages</h3>
              <nav className="space-y-2">
                {pages.map((page: Page) => (
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
                      year: 'numeric' 
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
      </main>
    </DefaultLayout>
  );
};