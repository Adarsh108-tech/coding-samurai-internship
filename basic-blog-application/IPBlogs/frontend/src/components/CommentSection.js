'use client';
import { motion } from 'framer-motion';

export default function CommentSection({ comments = [] }) {
  return (
    <motion.div
      key="comment-section"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 overflow-hidden"
    >
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-4">
        {/* Render comments */}
        {comments.length > 0 ? (
          comments.map((comment, idx) => (
            <div key={idx} className="text-sm text-gray-800 dark:text-gray-200">
              {comment}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-300">No comments yet.</div>
        )}

        {/* Add comment box */}
        <input
          type="text"
          placeholder="Write a comment..."
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
    </motion.div>
  );
}
