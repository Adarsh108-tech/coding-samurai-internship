// db.js
const pgp = require("pg-promise")();
const db = pgp(process.env.SUPABASE_URL); // or your full config

module.exports = db;
