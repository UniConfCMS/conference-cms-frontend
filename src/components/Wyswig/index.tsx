import React, { useRef, useState, useCallback, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import style from "./Wyswig.module.css";
import "./WyswigFileIcon.css"; 
// @ts-ignore
import ImageResize from 'quill-image-resize-module-react';
import axios from 'axios';

interface WysiwygProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit?: (data: { title: string; content: string }) => Promise<void> | void;
  submitLabel?: string;
  loading?: boolean;
  mode?: "create" | "edit";
  conferenceId?: string;
}

export const Wysiwyg: React.FC<WysiwygProps> = ({
  initialTitle = "",
  initialContent = "",
  onSubmit,
  submitLabel = "Save page",
  loading = false,
  mode = "create",
  conferenceId,
}) => {
  const [formData, setFormData] = useState({
    title: initialTitle,
    content: initialContent,
  });
  const [saving, setSaving] = useState(false);
  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    setFormData({ title: initialTitle, content: initialContent });
  }, [initialTitle, initialContent]);

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
    }));
  };

  const fetchCsrfToken = async (): Promise<void> => {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
      });
    } catch (err) {
      console.error('Error fetching CSRF token:', err);
    }
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
        await fetchCsrfToken();

        const response = await axios.post("http://localhost:8000/api/admin/conferences/files", 
          formDataImg,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Accept': 'application/json',
            },
            withCredentials: true,
          }
        );

        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection(true);
        if (range) {
          editor?.insertEmbed(range.index, "image", `http://localhost:8000${response.data.locations}`);
        }
      } catch (err: any) {
        console.error("Image upload failed", err);
        alert(err.response?.data?.message || "Image loading zxc@scs.comerror");
      }
    };
  }, []);

  const fileHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.csv,.json,.xml,.mp3,.mp4,.avi,.mov,.mkv,.webm,.ogg,.wav,.flac,.svg,.psd,.ai,.eps,.xd,.sketch,.fig,.apk,.exe,.dmg,.iso,.tar,.gz,.tgz,.bz2,.rtf,.odt,.ods,.odp,.odg,.odf,.epub,.mobi,.azw,.fb2,.djvu,.cbz,.cbr");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formDataFile = new FormData();
      formDataFile.append("file", file);

      try {
        await fetchCsrfToken();

        const response = await axios.post("http://localhost:8000/api/admin/conferences/files", 
          formDataFile,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Accept': 'application/json',
            },
            withCredentials: true,
          }
        );

        const editor = quillRef.current?.getEditor();
        const range = editor?.getSelection(true);
        if (range) {
          editor?.insertEmbed(
            range.index,
            "link",
            `http://localhost:8000${response.data.locations}`
          );
          editor?.insertText(range.index, file.name, "link", `http://localhost:8000${response.data.locations}`);
        }
      } catch (err: any) {
        console.error("File upload failed", err);
        alert(err.response?.data?.message || "File upload error");
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
        ["link", "image", "file"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
        file: fileHandler,
      },
    },
    imageResize: {
      parchment: ReactQuill.Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
  };

  ReactQuill.Quill.register('modules/imageResize', ImageResize);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      if (onSubmit) {
        await onSubmit({ title: formData.title.trim(), content: formData.content });
      }
    } catch (error) {
      alert("Error saving page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {conferenceId && (
        <div className="w-full px-3 py-2 bg-gray-800 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 disabled:opacity-50">
          <span className="text-gray-700">
            Active conference ID: <strong>{conferenceId || "No conference selected"}</strong>
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="page-title" className="block text-sm font-medium text-gray-700 mb-2">
            Title of the page
          </label>
          <input
            type="text"
            id="page-title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 disabled:opacity-50"
            placeholder="Enter the name of the page"
            required
            disabled={saving || loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page content *.
          </label>
          <div className="border border-gray-300 rounded-md">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              modules={modules}
              value={formData.content}
              onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
              className={style.wysiwyg}
              placeholder="start writing the content of the page..."
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setFormData({ title: "", content: "" })}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={saving || loading}
          >
            Clean the mold
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving || loading ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};