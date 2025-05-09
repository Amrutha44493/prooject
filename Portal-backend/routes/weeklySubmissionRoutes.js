const express = require("express");
const router = express.Router();
const weeklyController = require('../controllers/weeklySubmissionController');
const auth = require('../middleware/auth');

// Create new submission
router.post('/submit',
    auth,
    (req, res, next) => {
        weeklyController.handleFileUpload(req, res, next);
    },
    async (req, res) => {
        // Check if submission is allowed (weekend) before creating
        const isPeriodOpenResult = await new Promise((resolve) => {
            weeklyController.getSubmissionPeriodStatus(req, {
                json: (data) => resolve(data.isOpen)
            });
        });

        if (!isPeriodOpenResult) {
            return res.status(403).json({
                success: false,
                message: 'Submissions are only allowed on weekends.'
            });
        }
        weeklyController.createSubmission(req, res);
    }
);

// Get all submissions for a student
router.get('/student/:student_id', auth, (req, res) => {
    weeklyController.getStudentSubmissions(req, res);
});

// Get weekly submissions count
router.get('/count/:studentId', auth, (req, res) => {
    weeklyController.getWeeklySubmissionsCount(req, res);
});

// Check submission period status
router.get('/period', auth, (req, res) => {
    weeklyController.getSubmissionPeriodStatus(req, res);
});

module.exports = router;