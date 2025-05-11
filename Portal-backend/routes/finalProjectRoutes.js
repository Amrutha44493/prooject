const express = require('express');
const router = express.Router();
const studentData = require('../models/studentData');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Setup Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'final_project_reports',
  allowedFormats: ['pdf', 'zip', 'rar', 'docx'],
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const finalReportUpload = multer({ storage: storage });

// Route: POST /student/:studentId/final-report
router.post('/student/:studentId/final-report', auth, finalReportUpload.single('file'), async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Student ID:', req.params.studentId);
    console.log('File Info:', req.file);

    const studentId = req.params.studentId;
    const comments = req.body.comment;
    const projectId = req.body.projectId;

    let submissionType = '';
    let link = '';
    let cloudinaryUrl = '';

    const student = await studentData.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.file) {
      submissionType = 'file';
      cloudinaryUrl = req.file.path;
    } else if (req.body.reportLink) {
      submissionType = 'link';
      link = req.body.reportLink;
    } else {
      return res.status(400).json({ message: 'Please upload a report file or provide a submission link.' });
    }

    student.finalProjectReport = {
      submissionType,
      link,
      cloudinaryUrl,
      comments,
      submissionDate: new Date(),
      submissionStatus: true,
      projectId,
    };

    await student.save();

    res.status(200).json({ message: 'Final project report submitted successfully!' });
  } catch (error) {
    console.error('Error submitting final report:', error);
    res.status(500).json({ message: 'Server error while submitting final report.' });
  }
});

router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const student = await studentData.findById(req.params.studentId).select('finalProjectReport');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const finalProjectReport = student.finalProjectReport || null;

    res.status(200).json({ finalProjectReport });
  } catch (error) {
    console.error('Error fetching final report:', error);
    res.status(500).json({ message: 'Server error while fetching final report.' });
  }
});

module.exports = router;
