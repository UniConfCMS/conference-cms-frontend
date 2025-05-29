import React from "react";
import { DefaultLayout } from "../../components/DefaultLayout";
import { useNavigate } from "react-router-dom";

const newspapers = [
  {
    id: 1,
    title: "School Science Fair 2025",
    date: "May 20, 2025",
    summary: "Discover the amazing projects created by our talented students at the annual science fair.",
  },
  {
    id: 2,
    title: "Spring Sports Festival",
    date: "April 15, 2025",
    summary: "Highlights and results from the recent sports competitions between local schools.",
  },
  {
    id: 3,
    title: "Art Exhibition",
    date: "March 30, 2025",
    summary: "Showcasing student artworks from various schools in the district. A visual delight!",
  },
  {
    id: 4,
    title: "New School Library Opens",
    date: "February 10, 2025",
    summary: "A look inside the newly opened school library featuring modern facilities and resources.",
  },
];

export const NewspaperView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">School Newspapers</h1>
          <button
            onClick={() => navigate("/newspaper/create")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
          >
            Create Newspaper
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newspapers.map(({ id, title, date, summary }) => (
            <article
              key={id}
              onClick={() => navigate(`/newspaper/${id}`)}
              className="bg-[#1a1a26] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <time className="block mb-4 text-gray-400 text-sm">{date}</time>
              <p className="text-gray-300">{summary}</p>
            </article>
          ))}
        </div>
      </main>
    </DefaultLayout>
  );
};
