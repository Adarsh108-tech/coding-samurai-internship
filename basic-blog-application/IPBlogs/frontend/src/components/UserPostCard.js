'use client';
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import CommentSection from './CommentSection';
import { toast } from 'react-hot-toast';

export default function UserPostCard({ post, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Delete failed');

      toast.success('Post deleted!');
      if (onDelete) onDelete(post.id); // Update parent list
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const stripHtml = (html) => {
    if (typeof window !== 'undefined') {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }
    return '';
  };

  const contentPreview = stripHtml(post.content)
    .split(' ')
    .slice(0, 100)
    .join(' ') + '...';

  return (
    <>
      {/* Expanded post modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-center items-center">
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-3xl h-[90vh] overflow-hidden z-50">
            <button
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-400 z-50"
              onClick={() => setIsExpanded(false)}
            >
              <X />
            </button>

            <div className="sticky top-0 bg-white dark:bg-gray-900 z-30 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <span className="font-semibold text-lg">{post.username}</span>
            </div>

            <div className="h-full overflow-y-auto p-6 pt-4">
              <h2 className="text-2xl font-bold mb-4">{post.title}</h2>

              <div
                className="text-gray-800 dark:text-gray-300 prose dark:prose-invert mb-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="grid gap-4 mb-4">
                {post.attachments?.map((att, i) =>
                  att.type === 'image' ? (
                    <Image
                      key={i}
                      src={att.url}
                      alt="attachment"
                      width={600}
                      height={300}
                      className="rounded object-cover"
                    />
                  ) : att.type === 'video' ? (
                    <video
                      key={i}
                      controls
                      src={att.url}
                      className="rounded w-full max-h-[400px]"
                    />
                  ) : att.type === 'pdf' ? (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View PDF
                    </a>
                  ) : null
                )}
              </div>

              <InteractionButtons
                showComments={showComments}
                setShowComments={setShowComments}
                post={post}
              />

              <AnimatePresence>
                {showComments && <CommentSection comments={post.comments || []} />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Card */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow hover:shadow-md transition z-10 relative">
        {/* 🗑️ Delete Button */}
        {userId === String(post.userId) && (
          <button
            onClick={handleDelete}
            className="absolute top-3 right-3 text-red-500 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        )}

        <div className="flex items-center gap-4 mb-2">
          <Image src={post.profilePic} alt="user" width={40} height={40} className="rounded-full" />
          <span className="font-semibold">{post.username}</span>
        </div>

        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p
          onClick={() => setIsExpanded(true)}
          className="text-gray-700 dark:text-gray-300 hover:text-blue-500 cursor-pointer"
        >
          {contentPreview}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {post.attachments?.slice(0, 2).map((att, i) =>
            att.type === 'image' ? (
              <Image
                key={i}
                src={att.url}
                alt="thumb"
                width={300}
                height={150}
                className="rounded"
              />
            ) : att.type === 'video' ? (
              <video key={i} src={att.url} className="rounded w-full max-h-[150px]" />
            ) : null
          )}
        </div>

        <InteractionButtons
          showComments={showComments}
          setShowComments={setShowComments}
          post={post}
        />

        <AnimatePresence>
          {showComments && <CommentSection comments={post.comments || []} />}
        </AnimatePresence>
      </div>
    </>
  );
}

function InteractionButtons({ showComments, setShowComments, post }) {
  return (
    <div className="flex items-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
      <button className="flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400">
        <ThumbsUp size={18} />
        <span>{post.likes ?? 0}</span>
      </button>
      <button className="flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400">
        <ThumbsDown size={18} />
        <span>{post.dislikes ?? 0}</span>
      </button>
      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400"
      >
        <MessageCircle size={18} />
        <span>{post.comments?.length ?? 0}</span>
      </button>
    </div>
  );
}
