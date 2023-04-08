const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true }
);

commentSchema.post("save", async function () {
  const comment = this;
  try {
    const comments = await Comment.find({ blog: comment.blog });

    const authorIds = comments
      .map((c) => c.author)
      .filter((authorId) => authorId.toString() !== comment.author.toString());

    await User.findByIdAndUpdate(comment.author, {
      $addToSet: { friends: { $each: authorIds } },
    });
  } catch (error) {
    console.error(error);
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
