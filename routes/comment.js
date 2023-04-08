const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

router.post("/blogs/:id/create", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const comment = new Comment({
      content: content,
      author: req.user.user.id,
      blog: blog.id,
    });

    await comment.save();
    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
