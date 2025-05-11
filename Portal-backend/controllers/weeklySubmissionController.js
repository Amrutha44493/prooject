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
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'auto'
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

// Get Weekly Submissions Count
const getWeeklySubmissionsCount = async (req, res) => {
  try {
    const { studentId } = req.params;
    
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
    const student = await studentData.findById(student_id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student.weeklySubmissionData || []);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching submissions',
      error: error.message 
    });
  }
};

// Create New Submission
const createSubmission = async (req, res) => {
  try {
    const { student_id, comment, link, weekNumber } = req.body;

    if (!student_id || !comment || !weekNumber) {
      return res.status(400).json({ 
        message: 'Student ID, comment, and week number are required'
      });
    }

    const student = await studentData.findById(student_id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check for existing submission for this week
    const existingSubmission = student.weeklySubmissionData.find(
      sub => sub.weekNumber === parseInt(weekNumber)
    );
    
    if (existingSubmission) {
      return res.status(400).json({ 
        message: 'Weekly submission already exists for this week'
      });
    }

    // Create new submission
    const newSubmission = {
      weekNumber: parseInt(weekNumber),
      comment,
      submissionType: req.file ? 'file' : 'link',
      createdAt: new Date()
    };

    if (req.file) {
      newSubmission.cloudinaryUrl = req.file.path;
      newSubmission.fileName = req.file.originalname;
    } else if (link) {
      newSubmission.link = link;
    } else {
      return res.status(400).json({ 
        message: 'Either file or link must be provided' 
      });
    }

    // Add to student's submissions
    student.weeklySubmissionData.push(newSubmission);
    await student.save();

    res.status(201).json({
      message: 'Submission created successfully',
      submission: newSubmission
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ 
      message: 'Error creating submission',
      error: error.message 
    });
  }
};

module.exports = {
  createSubmission,
  getStudentSubmissions,
  getWeeklySubmissionsCount,
  upload
};