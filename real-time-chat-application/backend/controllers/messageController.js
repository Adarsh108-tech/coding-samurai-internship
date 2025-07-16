const supabase = require("../db/supabaseClient");

exports.saveMessage = async (message) => {
  const { sender_id, receiver_id, content, is_group } = message;

  const { data, error } = await supabase
    .from("messages")
    .insert([{ sender_id, receiver_id, content, is_group }])
    .select()
    .single();

  if (error) {
    console.error("❌ Failed to save message:", error.message);
    return null;
  }

  return data;
};
