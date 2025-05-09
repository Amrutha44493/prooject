const studentData = require('../models/studentData');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'weekly_submissions',
        resource_type: 'auto'
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit only
}).single('file');

// Enhanced error handling wrapper for file upload
const handleFileUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File size exceeds 10MB limit.'
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message
            });
        } else if (err) {
            return res.status(500).json({
                success: false,
                message: 'File upload failed'
            });
        }
        next();
    });
};

// Get Weekly Submissions Count
const getWeeklySubmissionsCount = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
        }

        const student = await studentData.findById(studentId)
            .select('weeklySubmissionData');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const count = student.weeklySubmissionData?.length || 0;

        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        console.error('Error counting submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while counting submissions',
            error: error.message
        });
    }
};

// Get All Submissions for a Student
const getStudentSubmissions = async (req, res) => {
    try {
        const { student_id } = req.params;

        if (!student_id) {
            return res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
        }

        const student = await studentData.findById(student_id)
            .select('weeklySubmissionData');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json(student.weeklySubmissionData || []);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions',
            error: error.message
        });
    }
};

// Create New Submission (Direct Update)
const createSubmission = async (req, res) => {
    try {
        console.log('Raw request body:', req.body);
        const { student_id, comment, link, weekNumber } = req.body;

        // Debug logs to check incoming values
        console.log('Received values:', {
            student_id,
            weekNumber,
            hasFile: !!req.file,
            hasLink: !!link
        });

        // Validate required fields
        if (!student_id || !weekNumber) {
            return res.status(400).json({
                success: false,
                message: 'Student ID and week number are required'
            });
        }

        // Convert weekNumber to integer
        const weekNum = parseInt(weekNumber, 10);
        console.log('Parsed weekNum:', weekNum);

        const studentExists = await studentData.exists({ _id: student_id });
        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check for existing submission for this week
        const student = await studentData.findById(student_id).select('weeklySubmissionData');
        const existingSubmission = student.weeklySubmissionData.find(
            sub => sub.weekNumber === weekNum
        );

        if (existingSubmission) {
            return res.status(409).json({
                success: false,
                message: 'Weekly submission already exists for this week'
            });
        }

        // Validate either file or link is provided
        if (!req.file && !link) {
            return res.status(400).json({
                success: false,
                message: 'Either file or link must be provided'
            });
        }

        // Create new submission object
        const newSubmission = {
            weekNumber: weekNum,
            comment: comment || '',
            submissionType: req.file ? 'file' : 'link',
            createdAt: new Date()
        };

        if (req.file) {
            newSubmission.cloudinaryUrl = req.file.path;
            newSubmission.fileName = req.file.originalname;
        } else {
            newSubmission.link = link;
        }

        // Directly update the student's weeklySubmissionData array
        const updatedStudent = await studentData.findByIdAndUpdate(
            student_id,
            { $push: { weeklySubmissionData: newSubmission } },
            { new: true, select: 'weeklySubmissionData' } // Return the updated document's weeklySubmissionData
        );

        if (!updatedStudent) {
            return res.status(404).json({ success: false, message: 'Student not found during update.' });
        }

        res.status(201).json({
            success: true,
            message: 'Submission created successfully',
            submission: newSubmission
        });
    } catch (error) {
        console.error('Full submission error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Error creating submission',
            error: error.message
        });
    }
};

// Function to check if the current day is a weekend (Saturday or Sunday)
const isWeekend = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return day === 0 || day === 6;
};

// Check submission period status (now considers weekend)
const getSubmissionPeriodStatus = async (req, res) => {
    const isOpen = isWeekend();
    res.json({
        success: true,
        isOpen: isOpen,
        message: isOpen ? 'Submission period is currently open (weekend)' : 'Submission period is closed (weekdays)'
    });
};

module.exports = {
    createSubmission,
    getStudentSubmissions,
    getWeeklySubmissionsCount,
    handleFileUpload,
    getSubmissionPeriodStatus
};