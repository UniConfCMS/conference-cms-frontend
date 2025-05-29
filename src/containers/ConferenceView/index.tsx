import React, { useState, useEffect } from "react";
import { DefaultLayout } from "../../components/DefaultLayout";
import { useNavigate } from "react-router-dom";
import { Conference } from "../../interfaces/Conference"; 

export const ConferenceView: React.FC = () => {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch conferences from API
  const fetchConferences = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/conferences', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Conference[] = await response.json();
      setConferences(data);
      setError(null);
    } catch (err) {
      console.error('Error loading conferences:', err);
      setError('Failed to load conferences');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchConferences();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <DefaultLayout>
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading conferences...</div>
          </div>
        </main>
      </DefaultLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DefaultLayout>
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-xl text-red-500 mb-4">{error}</div>
            <button
              onClick={fetchConferences}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
            >
              Try again
            </button>
          </div>
        </main>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Conferences</h1>
          <button
            onClick={() => navigate("/newspaper/create")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
          >
            Create Article
          </button>
        </div>
        
        {conferences.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No conferences found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {conferences.map((conference: Conference) => (
              <article
                key={conference.id}
                onClick={() => navigate(`/newspaper/${conference.id}`)}
                className="bg-[#1a1a26] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {conference.title || 'No title'}
                </h2>
                <time className="block mb-4 text-gray-400 text-sm">
                  {conference.created_at 
                    ? new Date(conference.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    : 'No date'
                  }
                </time>
                <p className="text-gray-300">
                  Conference Year: {conference.year}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </DefaultLayout>
  );
};