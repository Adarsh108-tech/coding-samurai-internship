const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Optional: Run a quick test to confirm connection
(async () => {
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);
    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
    } else {
      console.log("✅ Supabase DB is connected");
    }
  } catch (err) {
    console.error("❌ Error testing Supabase connection:", err.message);
  }
})();

module.exports = supabase;
