const supabase = require("../db/supabaseClient");
const { createClient } = require("@supabase/supabase-js");


exports.updateProfile = async (req, res) => {
  const { id, name, description, resume_link, role, profile_picture, theme_mode, theme_color, background_image } = req.body;

  const { error } = await supabase
    .from("users")
    .update({ name, description, resume_link, role, profile_picture, theme_mode, theme_color, background_image })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Profile updated" });
};

exports.addContact = async (req, res) => {
  const userId = req.user.sub; // Authenticated user ID from middleware
  const { contactId } = req.body;

  if (!contactId) {
    return res.status(400).json({ error: "contactId is required" });
  }

  if (userId === contactId) {
    return res.status(400).json({ error: "You cannot add yourself as a contact." });
  }

  try {
    // Insert both directions: userId → contactId and contactId → userId
    const { data, error } = await supabase
      .from("contacts")
      .insert([
        { user_id: userId, contact_id: contactId },
        { user_id: contactId, contact_id: userId },
      ])
      .select("contact_id, contact:contact_id ( id, name, profile_picture )"); // join

    if (error) {
      // Handle duplicate insertion error (e.g., already mutual contacts)
      if (error.code === "23505") {
        return res.status(409).json({ error: "Contact already exists" });
      }

      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      message: "Contact added mutually",
      data,
    });
  } catch (err) {
    console.error("Add contact error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
};



exports.updatePassword = async (req, res) => {
  const { id, password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  const { error } = await supabase.auth.admin.updateUserById(id, {
    password,
  });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Password updated successfully" });
};



exports.getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user.sub; // Authenticated user ID

    // ✅ 1. Fetch user profile (safe single)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle(); // safer than .single()

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ 2. Fetch contacts
    const { data: contacts, error: contactsError } = await supabase
      .from("contacts")
      .select("contact_id, contact:contact_id ( id, name, profile_picture )")
      .eq("user_id", userId);

    if (contactsError) {
      return res.status(500).json({ error: contactsError.message });
    }

    // ✅ 3. Fetch groups
    const { data: groups, error: groupError } = await supabase
      .from("group_members")
      .select("group_id, group:group_id ( id, name, group_picture, description )")
      .eq("user_id", userId);

    if (groupError) {
      return res.status(500).json({ error: groupError.message });
    }

    return res.json({
      user,
      contacts: contacts.map((c) => c.contact),
      groups: groups.map((g) => g.group),
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};
