import React, { useState } from "react";
import { DefaultLayout } from "../../components/DefaultLayout";
import { useNavigate } from "react-router-dom";

export const CreateNewspaperView: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");

  const [errors, setErrors] = useState<{ title?: string; date?: string; summary?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!date) newErrors.date = "Date is required";
    if (!summary.trim()) newErrors.summary = "Summary is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    alert(`Newspaper created:\nTitle: ${title}\nDate: ${date}\nSummary: ${summary}`);

    setTitle("");
    setDate("");
    setSummary("");
    setErrors({});

    navigate("/newspaper");
  };

  const isFormValid = title.trim() !== "" && date !== "" && summary.trim() !== "";

  return (
    <DefaultLayout>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Create New Newspaper</h1>
        <form onSubmit={handleSubmit} className="bg-[#1a1a26] rounded-lg p-8 space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 font-semibold text-gray-300">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 ${
                errors.title ? "focus:ring-red-500 border border-red-500" : "focus:ring-blue-500"
              }`}
              placeholder="Enter newspaper title"
            />
            {errors.title && <p className="text-red-500 mt-1 text-sm">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block mb-2 font-semibold text-gray-300">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 ${
                errors.date ? "focus:ring-red-500 border border-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.date && <p className="text-red-500 mt-1 text-sm">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="summary" className="block mb-2 font-semibold text-gray-300">
              Summary
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
              className={`w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 ${
                errors.summary ? "focus:ring-red-500 border border-red-500" : "focus:ring-blue-500"
              }`}
              placeholder="Enter short summary"
            />
            {errors.summary && <p className="text-red-500 mt-1 text-sm">{errors.summary}</p>}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-6 py-3 rounded-md font-semibold w-full transition ${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                : "bg-gray-600 cursor-not-allowed text-gray-400"
            }`}
          >
            Create
          </button>
        </form>
      </main>
    </DefaultLayout>
  );
};
