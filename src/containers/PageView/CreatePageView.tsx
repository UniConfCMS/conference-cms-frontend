import React from "react";
import { useNavigate } from "react-router-dom";
import { DefaultLayout } from "../../components/DefaultLayout";
import { Wysiwyg } from "../../components/Wyswig"; 
export const CreatePageView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Create a new page
          </h1>
          <button
            onClick={() => navigate("/conferences")}
            className="px-4 py-2 border rounded-lg text-white hover:bg-gray-700 transition-colors"
          >
            Back to the conference
          </button>
        </div>
        <div className="bg-[#1a1a26] rounded-lg p-6">
          <Wysiwyg/>
        </div>
      </main>
    </DefaultLayout>
  );
};