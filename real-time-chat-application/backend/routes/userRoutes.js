const express = require("express");
const router = express.Router();
const supabase = require("../db/supabaseClient");
const {
  updateProfile,
  addContact,
  getUserDashboardData,
  updatePassword,
  getUserById,
} = require("../controllers/userController");

router.put("/profile", updateProfile);
router.post("/add-contact", addContact);
router.get("/dashboard" ,getUserDashboardData);
router.put("/update-password", updatePassword);

// ✅ GET /user/messages?receiver_id=...&is_group=...
router.get("/messages", async (req, res) => {
  const userId = req.user.sub; // ✅ Now matches what's set in middleware
  const { receiver_id, is_group } = req.query;

  try {
    let query;

    if (is_group === "true") {
      query = supabase
        .from("messages")
        .select("*")
        .eq("receiver_id", receiver_id)
        .eq("is_group", true)
        .order("created_at", { ascending: true });
    } else {
      query = supabase
        .from("messages")
        .select("*")
        .eq("is_group", false)
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${userId})`
        )
        .order("created_at", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Error fetching messages:", error.message);
      return res.status(500).json({ error: "Failed to fetch messages" });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


// ✅ POST /user/messages
router.post("/messages", async (req, res) => {
  const { userId } = req.user;
  const { receiver_id, content, is_group } = req.body;

  if (!receiver_id || !content) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: userId,
          receiver_id,
          content,
          is_group,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Error saving message:", error.message);
      return res.status(500).json({ error: "Failed to save message" });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("❌ Error saving message:", err.message);
    res.status(500).json({ error: "Failed to save message" });
  }
});

module.exports = router;
