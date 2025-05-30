import React, { useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import style from "./Wyswig.module.css";

export const Wysiwyg: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: ""
  });
  const [saving, setSaving] = useState(false);
  const quillRef = useRef<ReactQuill | null>(null);
  const { id } = useParams<{ id: string }>(); // Змінено з conferenceId на id
  const navigate = useNavigate();

  // Auto-generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formDataImg = new FormData();
      formDataImg.append("file", file);

      try {
        const res = await fetch("http://localhost:8000/api/admin/conferences/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataImg,
        });

        const data = await res.json();
        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection(true);
        if (range) {
          editor?.insertEmbed(range.index, "image", `http://localhost:8000${data.locations}`);
        }
      } catch (err) {
        console.error("Image upload failed", err);
        alert("Помилка завантаження зображення");
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!id) {
      console.error("Conference ID is not available");
      alert("Конференція не вибрана");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`http://localhost:8000/api/admin/conferences/${id}/pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content,
        }),
      });

      if (response.ok) {
        const newPage = await response.json();
        alert("Сторінка успішно створена!");
        setFormData({ title: "", slug: "", content: "" });
        navigate(`/conferences/${id}`, {
          state: { selectedPage: newPage },
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Не вдалося створити сторінку");
      }
    } catch (error) {
      console.error("Помилка при створенні сторінки:", error);
      alert("Помилка при створенні сторінки");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Conference ID Display */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <span className="text-gray-700">
          Активна конференція ID: <strong>{id || "Немає"}</strong>
        </span>
      </div>

      {/* Page Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="page-title" className="block text-sm font-medium text-gray-700 mb-2">
            Назва сторінки *
          </label>
          <input
            type="text"
            id="page-title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 disabled:opacity-50"            placeholder="Введіть назву сторінки"
            required
            disabled={saving}
          />
        </div>


        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Вміст сторінки *
          </label>
          <div className="border border-gray-300 rounded-md">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              modules={modules}
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              className={style.wysiwyg}
              placeholder="Почніть писати вміст сторінки..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setFormData({ title: "", slug: "", content: "" })}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={saving}
          >
            Очистити форму
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? "Збереження..." : "Зберегти сторінку"}
          </button>
        </div>
      </form>
    </div>
  );
};