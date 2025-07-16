const supabase = require("../db/supabaseClient");

// POST /auth/register
exports.registerUser = async (req, res) => {
  const { email, password, fullName } = req.body;

  console.log("🛂 Registering:", { email, password, fullName });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName // 👈 important for trigger to work!
      }
    }
  });

  if (error) {
    console.error("❌ Registration error:", error.message);
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Registration successful", user: data.user });
};

// POST /auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return res.status(401).json({ error: error.message });

  res.json({ message: "Login successful", session: data.session, user: data.user });
};
