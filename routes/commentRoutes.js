const express = require("express");
const router = express.Router();
const {
  addComment,
  getComments,
  updateComment,
  deleteComment
} = require("../controllers/commentController");

// ➕ Add comment
router.post("/", addComment);

// 📥 Get all comments
router.get("/", getComments);

// ✏ Update comment
router.put("/:id", updateComment);

// ❌ Delete comment
router.delete("/:id", deleteComment);

module.exports = router;
