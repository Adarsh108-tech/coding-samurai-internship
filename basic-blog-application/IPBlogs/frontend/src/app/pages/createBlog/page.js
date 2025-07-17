'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import axios from 'axios';
import { UploadCloud, Menu } from 'lucide-react';
import Sidebar from '@/components/SideBar';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '',
  });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 5) {
      toast.error('You can upload a maximum of 5 files.');
      return;
    }
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editor?.getHTML();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please login first.');
      return;
    }

    if (!title || !desc || !content) {
      toast.error('All fields are required.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', desc);
      formData.append('content', content);
      files.forEach((file) => formData.append('files', file));

      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Blog created successfully!');
      router.push('/pages/home');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while creating the post.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-6 ">
        {/* Top Navbar with Mobile Toggle */}
        <div className="md:hidden mb-4">
          <button onClick={() => setSidebarOpen(true)} className="text-violet-600 dark:text-violet-300">
            <Menu size={24} />
          </button>
        </div>

        <Navbar header="Create a Blog" />

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Create a New Blog Post</h1>

          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border dark:border-gray-700 rounded dark:bg-gray-800"
          />

          <textarea
            placeholder="Short Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full p-3 border dark:border-gray-700 rounded dark:bg-gray-800"
            rows={3}
          />

          <div className="border rounded dark:border-gray-700 dark:bg-gray-800 p-4">
            <label className="block mb-2 font-semibold">Blog Content</label>
            <EditorContent
              editor={editor}
              className="bg-white dark:bg-gray-700 p-4 rounded min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold">Upload up to 5 files (images, videos, PDFs)</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <UploadCloud size={18} /> Choose Files
              </button>
            </div>

            <input
              type="file"
              accept="image/*,video/*,application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              hidden
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm flex gap-2 items-center"
                >
                  <span className="truncate">{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-violet-600 hover:bg-violet-700 text-white py-2 px-6 rounded transition disabled:opacity-50"
          >
            {uploading ? 'Publishing...' : 'Publish'}
          </button>
        </form>
      </main>
    </div>
  );
}
