import React, { useState, useEffect, useContext, useMemo } from "react";
import { DefaultLayout } from "../../components/DefaultLayout";
import { useNavigate } from "react-router-dom";
import { Conference } from "../../interfaces/Conference";
import { DeleteConferenceModal } from "./DelateConferenceModel";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';

type SortOption = 'title-asc' | 'title-desc' | 'year-asc' | 'year-desc' | 'date-asc' | 'date-desc';

export const ConferenceView: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Search and sorting state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const isAdmin = user?.role === "admin";

  const fetchConferences = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("http://localhost:8000/api/conferences", {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setConferences(response.data);
    } catch (err: any) {
      console.error("Error loading conferences:", err);
      setError(err.response?.data?.error || err.message || "Failed to load conferences");
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted conferences
  const filteredAndSortedConferences = useMemo(() => {
    let filtered = conferences.filter(conference =>
      conference.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conference.year?.toString().includes(searchTerm)
    );

    // Sort conferences
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'year-asc':
          return (a.year || 0) - (b.year || 0);
        case 'year-desc':
          return (b.year || 0) - (a.year || 0);
        default:
          return 0;
      }
    });
  }, [conferences, searchTerm, sortBy]);

  const handleDeleteClick = (e: React.MouseEvent, conference: Conference) => {
    e.stopPropagation();
    setSelectedConference(conference);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, conference: Conference) => {
    e.stopPropagation();
    navigate(`/conferences/${conference.id}/edit`);
  };

  const handleDeleteConference = async (conferenceId: number): Promise<void> => {
    if (!token || !isAdmin) {
      setError("Insufficient permissions to delete conference");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      console.log(`Attempting to delete conference ${conferenceId}`);

      await axios.delete(`http://localhost:8000/api/admin/conferences/${conferenceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        withCredentials: true,
      });

      console.log(`Conference ${conferenceId} deleted successfully`);
      setConferences((prev) => prev.filter((conf) => conf.id !== conferenceId));
      setIsDeleteModalOpen(false);
      setSelectedConference(null);
    } catch (err: any) {
      console.error("Error deleting conference:", err);
      let errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to delete conference";
      
      if (err.response?.status === 403) {
        errorMessage = "Insufficient permissions to delete conference";
      } else if (err.response?.status === 404) {
        errorMessage = "Conference not found";
      } else if (err.response?.status === 401) {
        errorMessage = "Authorization required";
      }

      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedConference(null);
    setError(null);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  if (loading) {
    return (
      <DefaultLayout>
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-xl text-white">Loading conferences...</div>
            </div>
          </div>
        </main>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white">Conferences</h1>
          {isAdmin && (
            <button
              onClick={() => navigate("/conferences-create")}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white transition"
            >
              Create New Conference
            </button>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-[#1a1a26] rounded-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Conferences
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title or year..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="title-asc">Title (A to Z)</option>
                <option value="title-desc">Title (Z to A)</option>
                <option value="year-desc">Year (High to Low)</option>
                <option value="year-asc">Year (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 text-sm text-gray-400">
            {searchTerm ? (
              <>
                Showing {filteredAndSortedConferences.length} of {conferences.length} conferences
                {filteredAndSortedConferences.length !== conferences.length && (
                  <span className="ml-2 text-blue-400">
                    (filtered by "{searchTerm}")
                  </span>
                )}
              </>
            ) : (
              `Showing all ${conferences.length} conferences`
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-red-400">❌</span>
                <span className="text-red-100">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-200"
              >
                ✕
              </button>
            </div>
            {error.includes("Failed to load") && (
              <button
                onClick={fetchConferences}
                className="mt-3 bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md transition text-white text-sm"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {filteredAndSortedConferences.length === 0 ? (
          <div className="text-center py-10">
            {searchTerm ? (
              <>
                <p className="text-gray-400 mb-2">No conferences match your search</p>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your search terms</p>
                <button
                  onClick={clearSearch}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition text-white mr-2"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-400">No conferences found</p>
                <button
                  onClick={fetchConferences}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition text-white"
                >
                  Refresh
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedConferences.map((conference: Conference) => (
              <article
                key={conference.id}
                className="bg-[#1a1a26] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow relative group"
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      onClick={() => navigate(`/conferences/${conference.id}`)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 text-white"
                      title="View Conference"
                    >
                      👁️
                    </button>
                    <button
                      onClick={(e) => handleEditClick(e, conference)}
                      className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors duration-200 text-white"
                      title="Edit Conference"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, conference)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 text-white"
                      title="Delete Conference"
                      disabled={isDeleting}
                    >
                      🗑️
                    </button>
                  </div>
                )}

                <div
                  onClick={() => navigate(`/conferences/${conference.id}`)}
                  className="cursor-pointer"
                >
                  <h2 className={`text-xl font-semibold mb-2 text-white ${isAdmin ? "pr-16" : ""}`}>
                    {conference.title || "No Title"}
                  </h2>
                  <time className="block mb-4 text-gray-400 text-sm">
                    {conference.created_at
                      ? new Date(conference.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No Date"}
                  </time>
                  <p className="text-gray-300">Conference Year: {conference.year}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <DeleteConferenceModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          conference={selectedConference}
          onDelete={handleDeleteConference}
          isDeleting={isDeleting}
          userRole={user?.role}
        />
      </main>
    </DefaultLayout>
  );
};