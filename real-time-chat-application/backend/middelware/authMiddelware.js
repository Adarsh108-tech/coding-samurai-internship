const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 Authorization Header:", authHeader);

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  console.log("🔐 Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    console.log("✅ Token verified. Payload:", decoded);

    if (!decoded.sub) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { sub: decoded.sub };
    next();
  } catch (err) {
    console.error("❌ JWT Verification Failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;