const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Blog = require("../models/blog");
const User = require("../models/user");

router.post("/create", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ msg: "Please provide a title and content" });
    }

    const newBlog = new Blog({
      title,
      content,
      author: req.user.user.id,
    });

    await newBlog.save();

    await User.findByIdAndUpdate(req.user.user.id, {
      $addToSet: { blogs: newBlog._id },
    });

    res.status(201).json(newBlog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
