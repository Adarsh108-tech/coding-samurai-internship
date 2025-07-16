const express = require("express");
const router = express.Router();
const { createGroup, addMembersToGroup } = require("../controllers/groupController");

router.post("/create", createGroup);
router.post("/add-members", addMembersToGroup); // Optional route if you want to add members later

module.exports = router;
