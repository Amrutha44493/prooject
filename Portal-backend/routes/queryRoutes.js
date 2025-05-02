const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const queryModel = require("../models/Query");
const studentModel = require("../models/studentData");

// GET all queries with author and comment authors populated

router.get("/", async (req, res) => {
  try {
    const queries = await queryModel
      .find()
      .populate("author", "name")
      .populate("comments.author", "name"); 
    res.json(queries);
  } catch (err) {
    console.error("Error fetching queries:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch queries", details: err.message });
  }
});


// post query
router.post("/", async (req, res) => {
  const { author, title, description } = req.body;

  if (!author || !title || !description) {
    return res.status(400).json({ error: "Author, title, and description are required" });
  }

  try {
    const student = await studentModel.findById(author); 

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const newQuery = new queryModel({
      author: student._id,
      title,
      description,
    });

    await newQuery.save();
    const populatedQuery = await newQuery.populate("author", "name");

    res.status(201).json(populatedQuery);
  } catch (err) {
    console.error("Error creating query:", err.message);
    res.status(500).json({ error: "Failed to create query", details: err.message });
  }
});

// POST a comment to a query
router.post("/:queryId/comment", async (req, res) => {
  const { text, author } = req.body; // 'author' is studentId
  const { queryId } = req.params;

  if (!author || !text) {
    return res.status(400).json({ error: "Text and author are required" });
  }

  try {
    const student = await studentModel.findById(author);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const query = await queryModel.findById(queryId);
    if (!query) return res.status(404).json({ error: "Query not found" });

    query.comments.push({ author, text });
    await query.save();

    res.status(200).json({ message: "Comment added" });
  } catch (err) {
    console.error("Error posting comment:", err.message);
    res.status(500).json({ error: "Failed to post comment", details: err.message });
  }
});

// edit query
router.put("/:queryId", async (req, res) => {
  const { queryId } = req.params;
  const { title, description } = req.body;

  try {
    const query = await queryModel.findByIdAndUpdate(
      queryId,
      { title, description },
      { new: true }
    ).populate("author", "name");

    if (!query) return res.status(404).json({ error: "Query not found" });

    res.json(query);
  } catch (err) {
    console.error("Error updating query:", err);
    res.status(500).json({ error: "Failed to update query" });
  }
});

// PUT: Like or unlike a query
router.put("/:queryId/like", async (req, res) => {
  const { queryId } = req.params;
  const userId = req.body.studentId || req.user?.id;

  try {
    const query = await queryModel.findById(queryId);
    if (!query) return res.status(404).json({ error: "Query not found" });

    const index = query.likes.indexOf(userId);
    if (index === -1) {
      query.likes.push(userId);
    } else {
      query.likes.splice(index, 1); // unlike
    }

    await query.save();
    res.json({ likes: query.likes.length });
  } catch (err) {
    console.error("Error liking query:", err);
    res.status(500).json({ error: "Failed to like query" });
  }
});

// PUT: Like or unlike a comment
router.put("/:queryId/comment/:commentId/like", async (req, res) => {
  const { queryId, commentId } = req.params;
  const userId = req.body.studentId || req.user?.id;

  try {
    const query = await queryModel.findById(queryId);
    if (!query) return res.status(404).json({ error: "Query not found" });

    const comment = query.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const index = comment.likes.indexOf(userId);
    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(index, 1); // unlike
    }

    await query.save();
    res.json({ likes: comment.likes.length });
  } catch (err) {
    console.error("Error liking comment:", err);
    res.status(500).json({ error: "Failed to like comment" });
  }
});




module.exports = router;
