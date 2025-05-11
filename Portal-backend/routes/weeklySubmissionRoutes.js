const express = require("express");
const router = express.Router();
const weeklyController = require('../controllers/weeklySubmissionController');
const auth = require('../middleware/auth');

// Create new submission
router.post('/submit', auth, weeklyController.upload.single('file'), weeklyController.createSubmission);

// Get all submissions for a student
router.get('/student/:student_id', auth, weeklyController.getStudentSubmissions);

// Get weekly submissions count
router.get('/count/:studentId', auth, weeklyController.getWeeklySubmissionsCount);

// Check submission period status
router.get('/period', auth, (req, res) => {
  res.json({ isOpen: true });
});

module.exports = router;