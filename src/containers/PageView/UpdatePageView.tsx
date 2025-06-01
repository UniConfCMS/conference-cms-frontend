import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DefaultLayout } from '../../components/DefaultLayout';
import { Wysiwyg } from '../../components/Wyswig';
import { Page } from '../../interfaces/Page';

export const UpdatePageView: React.FC = () => {
  const { id, pageId } = useParams<{ id: string; pageId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/conferences/${id}/pages`);
      if (response.ok) {
        const pages: Page[] = await response.json();
        const found = pages.find((p) => p.id === Number(pageId));
        setPage(found || null);
      }
      setLoading(false);
    };
    fetchPage();
  }, [id, pageId]);

  const handleUpdate = async (data: { title: string; content: string }) => {
    if (!id || !pageId) return;
    setSaving(true);
    const response = await fetch(`http://localhost:8000/api/admin/conferences/${id}/pages/${pageId}/content`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
      }),
    });
    setSaving(false);
    if (response.ok) {
      alert('Page updated!');
      navigate(`/conferences/${id}`);
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Could not update page');
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
