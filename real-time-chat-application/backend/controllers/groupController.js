const supabase = require("../db/supabaseClient");
const { createClient } = require('@supabase/supabase-js');
// POST /group/create
exports.createGroup = async (req, res) => {
  const { name, description, group_picture, created_by, members } = req.body;

  // Step 1: Create group
  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .insert([{ name, description, group_picture, created_by }])
    .select()
    .single();

  if (groupError) return res.status(500).json({ error: groupError.message });

  const groupId = groupData.id;

  // Step 2: Add members to group_members
  const memberEntries = members.map((userId) => ({
    group_id: groupId,
    user_id: userId
  }));

  const { error: membersError } = await supabase
    .from("group_members")
    .insert(memberEntries);

  if (membersError) return res.status(500).json({ error: membersError.message });

  res.json({ message: "Group created", group: groupData });
};

exports.addMembersToGroup = async (req, res) => {
  console.log("BODY RECEIVED:", req.body); // ✅ Debug here

  const { group_id, user_ids } = req.body;

  if (!group_id || !user_ids?.length) {
    return res.status(400).json({ error: "Missing group_id or user_ids" });
  }

  const entries = user_ids.map((userId) => ({
    group_id,
    user_id: userId,
  }));

  const { error } = await supabase.from("group_members").insert(entries);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Members added successfully" });
};