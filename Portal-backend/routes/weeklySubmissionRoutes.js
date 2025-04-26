const express = require("express");
const router = express.Router();
const { createSubmission, getStudentSubmissions, upload } = require('../controllers/weeklySubmissionController');
const auth = require('../middleware/auth');

// Create a new submission (handles both link and file submissions)
router.post('/submit', auth, upload.single('file'), createSubmission);

// Get all submissions for a student
router.get('/student/:student_id', auth, getStudentSubmissions);

module.exports = router;