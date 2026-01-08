const Comment = require("../models/Comment");

// ➕ ADD COMMENT
exports.addComment = async (req, res) => {
  const { userId, comment } = req.body;

  const newComment = await Comment.create({
    userId,
    comment
  });

  res.json(newComment);
};

// 📥 GET ALL COMMENTS (Website reviews)
exports.getComments = async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.json(comments);
};

// ✏ UPDATE COMMENT
exports.updateComment = async (req, res) => {
  const updated = await Comment.findByIdAndUpdate(
    req.params.id,
    { comment: req.body.comment },
    { new: true }
  );

  res.json(updated);
};

// ❌ DELETE COMMENT
exports.deleteComment = async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
