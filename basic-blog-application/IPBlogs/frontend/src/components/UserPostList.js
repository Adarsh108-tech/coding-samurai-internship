'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import UserPostCard from './UserPostCard';
import toast from 'react-hot-toast';

export default function UserPostsList({ userId }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/posts/user/${userId}?page=${page}&limit=10`
        );

        const { posts, totalPages } = res.data;
        setPosts(posts);
        setTotalPages(totalPages);
      } catch (err) {
        console.error('Failed to fetch user posts:', err);
        toast.error('Could not fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, page]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="w-full overflow-y-auto" style={{ height: '80%' }}>
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No posts found.</p>
      ) : (
        <div className="flex flex-col gap-4 p-4">
          {posts.map((post) => (
            <UserPostCard
              key={post.id}
              post={{
                ...post,
                userId: post.user_id, // ✅ Pass this correctly!
                username: post.author_name || 'Anonymous',
                profilePic: '/default-user.png',
              }}
              onDelete={handlePostDelete}
            />
          ))}

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-300 font-semibold pt-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
