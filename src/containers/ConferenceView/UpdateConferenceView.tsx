import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Conference } from "../../interfaces/Conference";
import { DefaultLayout } from "../../components/DefaultLayout";


export const EditConferenceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  const [conference, setConference] = useState<Conference | null>(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id || !token) {
      setError("Invalid conference ID or unauthorized");
      setLoading(false);
      return;
    }

    const fetchConference = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/conferences/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to load conference: ${res.status}`);
        }

        const data: Conference = await res.json();
        setConference(data);
        setTitle(data.title);
        setYear(data.year.toString());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load conference");
      } finally {
        setLoading(false);
      }
    };

    fetchConference();
  }, [id, token]);

  const validateForm = () => {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!year || isNaN(parseInt(year)) || parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear() + 10) {
      setError("Please enter a valid year (1900–2035)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!id || !validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8000/api/admin/conferences/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, year: parseInt(year) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Update failed: ${response.status}`);
      }

      setSuccess("Conference updated successfully");
     
      setTimeout(() => navigate("/conferences"), 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
     
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <DefaultLayout>
        <main className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-red-400 text-center">You do not have permission to edit conferences.</p>
        </main>
      </DefaultLayout>
    );
  }

  if (loading) {
    return (
      <DefaultLayout>
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-xl text-white">Loading conference...</div>
            </div>
          </div>
        </main>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="max-w-md mx-auto bg-[#1a1a26] p-6 rounded-2xl shadow-lg">
          <h2 className="text-white text-2xl font-bold mb-6">Edit Conference</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-100 flex items-center space-x-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg text-green-100 flex items-center space-x-2">
              <span>✅</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-300 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter conference title"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="year" className="block text-gray-300 mb-1">
                Year
              </label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter conference year"
                min="1900"
                max={new Date().getFullYear() + 10}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/conferences")}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </DefaultLayout>
  );
};