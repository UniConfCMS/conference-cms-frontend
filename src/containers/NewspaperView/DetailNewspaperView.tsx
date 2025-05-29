import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DefaultLayout } from "../../components/DefaultLayout";

const newspapers = [
  {
    id: 1,
    title: "School Science Fair 2025",
    date: "May 20, 2025",
    summary: "Discover the amazing projects created by our talented students at the annual science fair.",
    content: `This year's science fair featured innovative projects in robotics, biology, and environmental science.
    Students demonstrated creativity and scientific rigor, attracting many visitors from the community. 
    Awards were given to the top three projects.`,
  },
  {
    id: 2,
    title: "Spring Sports Festival",
    date: "April 15, 2025",
    summary: "Highlights and results from the recent sports competitions between local schools.",
    content: `The Spring Sports Festival brought together students from various schools competing in track, football, basketball, and swimming.
    The event was full of energy and sportsmanship, with many records broken and new friendships formed.`,
  },
];

export const DetailNewspaperView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const newspaper = newspapers.find((item) => item.id === Number(id));

  if (!newspaper) {
    return (
      <DefaultLayout>
        <main className="max-w-4xl mx-auto px-6 py-10 text-white">
          <p>Newspaper not found.</p>
          <button
            onClick={() => navigate("/newspaper")}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Back to list
          </button>
        </main>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <main className="max-w-4xl mx-auto px-6 py-10 bg-[#1a1a26] rounded-lg">
        <div className="flex justify-between">
            <h1 className="text-3xl font-bold mb-4 text-white">{newspaper.title}</h1>
            <button
                onClick={() => navigate("/newspaper")}
                className="mb-6 px-4 py-2 border rounded-lg">
                Back
            </button>
        </div>
        <time className="block mb-6 text-gray-400">{newspaper.date}</time>
        <p className="text-gray-300 whitespace-pre-line">{newspaper.content}</p>
      </main>
    </DefaultLayout>
  );
};
