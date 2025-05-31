import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { DefaultLayout } from "../../components/DefaultLayout";

export const CreateConferenceView = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const parsedYear = parseInt(year);
    if (!year || isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 10) {
      setError("Please enter a valid year (1900–2035)");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/admin/conferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, year: parsedYear }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error creating conference");
      }

      setSuccess(`Conference "${data.title}" successfully created`);
      setTitle("");
      setYear("");

     
      setTimeout(() => {
        navigate(`/conferences/${data.id}`);
      }, 1000);
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
          <p className="text-red-400 text-center">You do not have permission to create conferences.</p>
        </main>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="max-w-md mx-auto bg-[#1a1a26] p-6 rounded-2xl shadow-lg">
          <h2 className="text-white text-2xl font-bold mb-6">Create Conference</h2>

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
              <label htmlFor="title" className="block text-gray-300 mb-1">Title</label>
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
              <label htmlFor="year" className="block text-gray-300 mb-1">Year</label>
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

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Conference"}
            </button>
          </form>
        </div>
      </main>
    </DefaultLayout>
  );
};
