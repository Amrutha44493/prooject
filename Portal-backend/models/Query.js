const mongoose = require("mongoose");

// Comment Schema
const commentSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "student" },
  text: String,
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],
});

// Main Query Schema
const querySchema = mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "student" },
    title: String,
    description: String,
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],
  },
  {
    timestamps: { createdAt: "createdAt" }, // auto update timestamps
  }
);

const Query = mongoose.model("discussion", querySchema);
module.exports = Query;
