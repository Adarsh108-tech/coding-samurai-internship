const jwt = require("jsonwebtoken");


function authenticateDashToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // 👈 this should contain `sub` field
    next();
  });
}

module.exports = authenticateDashToken;