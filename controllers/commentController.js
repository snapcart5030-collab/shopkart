const Comment = require("../models/Comment");

// ➕ ADD COMMENT (PUBLIC)
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment is required"
      });
    }

    const newComment = await Comment.create({
      comment
    });

    res.status(201).json(newComment);

  } catch (err) {
    console.error("ADD COMMENT ERROR", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// 📥 GET ALL COMMENTS
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (err) {
    res.status(500).json({ message: "Failed to load comments" });
  }
};

// ✏ UPDATE COMMENT (OPTIONAL – ADMIN / OWNER)
exports.updateComment = async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { comment: req.body.comment },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// ❌ DELETE COMMENT (OPTIONAL – ADMIN)
exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
