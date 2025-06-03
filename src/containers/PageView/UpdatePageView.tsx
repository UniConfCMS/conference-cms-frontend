import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DefaultLayout } from '../../components/DefaultLayout';
import { Wysiwyg } from '../../components/Wyswig';
import { Page } from '../../interfaces/Page';
import axios from 'axios';

export const UpdatePageView: React.FC = () => {
  const { id, pageId } = useParams<{ id: string; pageId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      if (!id || !pageId) return;
      setLoading(true);
      try {
        const response = await axios.get<Page[]>(`http://localhost:8000/api/conferences/${id}/pages`);
        const found = response.data.find((p) => p.id === Number(pageId));
        setPage(found || null);
      } catch (error) {
        console.error('Failed to load page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id, pageId]);

  const handleUpdate = async (data: { title: string; content: string }) => {
    if (!id || !pageId) return;
    setSaving(true);
    try {
      await axios.patch(
        `http://localhost:8000/api/admin/conferences/${id}/pages/${pageId}/content`,
        {
          title: data.title,
          content: data.content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Page updated!');
      navigate(`/conferences/${id}`);
    } catch (error: any) {
      console.error('Error updating page:', error);
      const message = error.response?.data?.message || 'Could not update page';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DefaultLayout>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-0">Edit Page</h1>
          <button
            onClick={() => navigate(`/conferences/${id}`)}
            className="px-4 py-2 border rounded-lg text-white hover:bg-gray-700 transition-colors"
          >
            Back to the conference
          </button>
        </div>
        <div className="bg-[#1a1a26] rounded-lg p-6">
          {loading || !page ? (
            <div className="text-gray-400">Loading page data...</div>
          ) : (
            <Wysiwyg
              initialTitle={page.title}
              initialContent={page.content}
              onSubmit={handleUpdate}
              submitLabel="Update page"
              mode="edit"
              loading={saving}
              conferenceId={id}
            />
          )}
        </div>
      </main>
    </DefaultLayout>
  );
};
