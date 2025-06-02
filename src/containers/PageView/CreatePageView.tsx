import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DefaultLayout } from "../../components/DefaultLayout";
import { Wysiwyg } from "../../components/Wyswig";

export const CreatePageView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleCreate = async (data: { title: string; content: string }) => {
    if (!id) {
      alert("Conference not selected");
      return;
    }
    const response = await fetch(`http://localhost:8000/api/admin/conferences/${id}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
      }),
    });
    if (response.ok) {
      const newPage = await response.json();
      alert("Page created successfully!");
      navigate(`/conferences/${id}`, {
        state: { selectedPage: newPage },
      });
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Could not create a page");
    }
  };

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
          <Wysiwyg
            onSubmit={handleCreate}
            submitLabel="Save page"
            mode="create"
            conferenceId={id}
          />
        </div>
      </main>
    </DefaultLayout>
  );
};