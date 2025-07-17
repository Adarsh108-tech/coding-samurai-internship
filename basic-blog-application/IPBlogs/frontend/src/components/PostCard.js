'use client';
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, X } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import CommentSection from './CommentSection';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function PostCard({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes ?? 0);
  const [dislikes, setDislikes] = useState(post.dislikes ?? 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count ?? 0);

  const router = useRouter();

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

  const handleReaction = async (reaction) => {
    
    try {
      await axios.post(`http://localhost:5000/api/posts/${post.id}/reaction`, { reaction });
      if (reaction === 'like') {
        setLikes((prev) => prev + 1);
        if (dislikes > 0) setDislikes((prev) => prev - 1);
      } else {
        setDislikes((prev) => prev + 1);
        if (likes > 0) setLikes((prev) => prev - 1);
      }
    } catch (err) {
      console.error('Reaction failed:', err);
    }
  };

  return (
    <>
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
                likes={likes}
                dislikes={dislikes}
                commentsCount={commentsCount}
                onReact={handleReaction}
              />

              <AnimatePresence>
                {showComments && (
                  <CommentSection postId={post.id} onComment={() => setCommentsCount((c) => c + 1)} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow hover:shadow-md transition z-10">
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
          likes={likes}
          dislikes={dislikes}
          commentsCount={commentsCount}
          onReact={handleReaction}
        />

        <AnimatePresence>
          {showComments && (
            <CommentSection postId={post.id} onComment={() => setCommentsCount((c) => c + 1)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function InteractionButtons({ showComments, setShowComments, likes, dislikes, commentsCount, onReact }) {
  return (
    <div className="flex items-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
      <button
        onClick={() => onReact('like')}
        className="flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400"
      >
        <ThumbsUp size={18} />
        <span>{likes}</span>
      </button>
      <button
        onClick={() => onReact('dislike')}
        className="flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400"
      >
        <ThumbsDown size={18} />
        <span>{dislikes}</span>
      </button>
      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400"
      >
        <MessageCircle size={18} />
        <span>{commentsCount}</span>
      </button>
    </div>
  );
}
