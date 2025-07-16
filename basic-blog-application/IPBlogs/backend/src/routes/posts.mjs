import express from "express";
import pool from "../config/db.mjs";
import verifyToken from "../middleware/validateUser.mjs";
import multer from "multer";
import cloudinary from "../utils/cloudinary.mjs";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Max 10MB per file
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/", "video/", "application/pdf"];
    if (allowed.some((type) => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});


// --- Add Like or Dislike ---
router.post("/:id/reaction", verifyToken, async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user.id;
  const { reaction } = req.body; // 'like' or 'dislike'

  if (!['like', 'dislike'].includes(reaction)) {
    return res.status(400).json({ msg: "Invalid reaction type" });
  }

  try {
    await pool.query(
      `
      INSERT INTO post_reactions (post_id, user_id, reaction_type)
      VALUES ($1, $2, $3)
      ON CONFLICT (post_id, user_id)
      DO UPDATE SET reaction_type = EXCLUDED.reaction_type
      `,
      [postId, userId, reaction]
    );
    res.json({ msg: `Post ${reaction}d` });
  } catch (err) {
    res.status(500).json({ msg: "Failed to react", error: err.message });
  }
});

// --- Add Comment ---
router.post("/:id/comment", verifyToken, async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  if (!content) return res.status(400).json({ msg: "Content is required" });

  try {
    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [postId, userId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: "Failed to comment", error: err.message });
  }
});

// --- Update existing GET all posts ---
// Add like/dislike count and comments count
router.get("/", async (req, res) => {
  try {
    const posts = await pool.query(`
      SELECT 
        posts.*, 
        users.name AS author_name,
        COALESCE(json_agg(DISTINCT attachments.*) FILTER (WHERE attachments.id IS NOT NULL), '[]') AS attachments,
        COUNT(DISTINCT c.id) AS comments_count,
        COUNT(DISTINCT pr_l.id) AS likes,
        COUNT(DISTINCT pr_d.id) AS dislikes
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN attachments ON posts.id = attachments.post_id
      LEFT JOIN comments c ON posts.id = c.post_id
      LEFT JOIN post_reactions pr_l ON posts.id = pr_l.post_id AND pr_l.reaction_type = 'like'
      LEFT JOIN post_reactions pr_d ON posts.id = pr_d.post_id AND pr_d.reaction_type = 'dislike'
      GROUP BY posts.id, users.name
      ORDER BY posts.created_at DESC
    `);

    res.json(posts.rows);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch posts", error: err.message });
  }
});

// --- Update GET /user/:userId ---
// Add like/dislike count and comments count to user posts
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const postsRes = await pool.query(
      `
      SELECT 
        p.*, 
        u.name AS author_name,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count,
        (SELECT COUNT(*) FROM post_reactions r WHERE r.post_id = p.id AND r.reaction_type = 'like') AS likes,
        (SELECT COUNT(*) FROM post_reactions r WHERE r.post_id = p.id AND r.reaction_type = 'dislike') AS dislikes
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
      `,
      [userId, limit, offset]
    );

    const posts = postsRes.rows;

    const postIds = posts.map((p) => p.id);

    const attachmentsRes = await pool.query(
      `SELECT post_id, id, url, type FROM attachments WHERE post_id = ANY($1::int[])`,
      [postIds]
    );

    const attachmentsByPostId = attachmentsRes.rows.reduce((acc, att) => {
      if (!acc[att.post_id]) acc[att.post_id] = [];
      acc[att.post_id].push(att);
      return acc;
    }, {});

    const finalPosts = posts.map((post) => ({
      ...post,
      attachments: attachmentsByPostId[post.id] || [],
    }));

    const countRes = await pool.query("SELECT COUNT(*) FROM posts WHERE user_id = $1", [userId]);
    const totalPosts = parseInt(countRes.rows[0].count);

    res.json({
      currentPage: page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      posts: finalPosts,
    });
  } catch (err) {
    console.error("❌ Error fetching user posts:", err);
    res.status(500).json({ msg: "Failed to fetch user posts", error: err.message });
  }
});


// GET single post (with attachments)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await pool.query(`
      SELECT 
        posts.*, 
        users.name AS author_name,
        COALESCE(json_agg(attachments.*) FILTER (WHERE attachments.id IS NOT NULL), '[]') AS attachments
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN attachments ON posts.id = attachments.post_id
      WHERE posts.id = $1
      GROUP BY posts.id, users.name
    `, [id]);

    if (!post.rows.length) return res.status(404).json({ msg: "Post not found" });

    res.json(post.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch post", error: err.message });
  }
});

router.post("/", verifyToken, upload.array("files", 5), async (req, res) => {
  const { title, description, content } = req.body;
  const userId = req.user.id;

  if (!title || !description || !content) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert blog post
    const postResult = await client.query(
      "INSERT INTO posts (user_id, title, description, content) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, title, description, content]
    );

    const postId = postResult.rows[0].id;

    // Upload attachments (if any)
    const attachments = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          console.log("Uploading:", file.originalname, file.mimetype);

          const uploadRes = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto",
                folder: "ipblogs",
              },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary upload error:", error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            stream.end(file.buffer);
          });

          attachments.push({
            url: uploadRes.secure_url,
            type: file.mimetype.startsWith("image")
              ? "image"
              : file.mimetype.startsWith("video")
              ? "video"
              : "pdf",
          });
        } catch (uploadErr) {
          console.error("Error uploading file to Cloudinary:", uploadErr);
          throw new Error("File upload failed");
        }
      }

      // Insert attachments using parameterized query
      const insertAttachmentQuery = `
        INSERT INTO attachments (post_id, url, type) VALUES 
        ${attachments.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(", ")}
      `;

      const values = [postId];
      attachments.forEach((att) => {
        values.push(att.url, att.type);
      });

      await client.query(insertAttachmentQuery, values);
    }

    await client.query("COMMIT");

    res.status(201).json({
      ...postResult.rows[0],
      attachments,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Upload error:", err);
    res.status(500).json({
      msg: "Post creation failed",
      error: err.message,
      stack: err.stack,
    });
  } finally {
    client.release();
  }
});

// UPDATE post
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, content } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "UPDATE posts SET title=$1, description=$2, content=$3 WHERE id=$4 AND user_id=$5 RETURNING *",
      [title, description, content, id, userId]
    );

    if (!result.rowCount) return res.status(403).json({ msg: "Unauthorized or not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
});

// DELETE post
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, userId]
    );

    if (!result.rowCount) return res.status(403).json({ msg: "Unauthorized or not found" });

    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
});

export default router;
