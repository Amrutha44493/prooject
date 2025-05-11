const studentData = require('../models/studentData');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'viva_voce',
    allowed_formats: ['pdf'],
    resource_type: 'auto',
    transformation: [{ quality: 'auto' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for viva voce submissions.'));
    }
  }
});

// Controller to handle viva voce upload
const uploadVivaVoce = async (req, res) => {
  try {
    const studentId = req.student.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const student = await studentData.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if project report has been submitted
    // if (!student.projectReport) {
    //   return res.status(400).json({ 
    //     message: 'You must submit your project report before submitting the viva voce.' 
    //   });
    // }

    // Check if final project report has been submitted
if (!student.finalProjectReport) {
  return res.status(400).json({ 
    message: 'You must submit your final project report before submitting the viva voce.' 
  });
}


    // Check if viva voce has already been submitted
    if (student.vivaVoce) {
      return res.status(400).json({ 
        message: 'You have already submitted your viva voce. Only one submission is allowed.' 
      });
    }

    // Update or create viva voce submission
    student.vivaVoce = {
      cloudinaryUrl: file.path,
      fileName: file.originalname,
      createdAt: new Date()
    };

    await student.save();

    res.status(201).json({
      message: 'Viva voce uploaded successfully',
      vivaVoce: student.vivaVoce
    });
  } catch (error) {
    console.error('Error uploading viva voce:', error);
    
    if (error.message.includes('Only PDF files are allowed')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('File too large')) {
      return res.status(400).json({ message: 'File size exceeds 10MB limit' });
    }

    res.status(500).json({ message: 'Error uploading viva voce', error: error.message });
  }
};

// Controller to get viva voce submission
const getVivaVoce = async (req, res) => {
  try {
    const studentId = req.student.id;

    const student = await studentData.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // res.status(200).json({
    //   vivaVoce: student.vivaVoce,
    //   projectReportSubmitted: !!student.projectReport,
    //   canSubmitVivaVoce: !!student.projectReport && !student.vivaVoce
    // });
    res.status(200).json({
  vivaVoce: student.vivaVoce,
  projectReportSubmitted: !!student.finalProjectReport,
  canSubmitVivaVoce: !!student.finalProjectReport && !student.vivaVoce
});

  } catch (error) {
    res.status(500).json({ message: 'Error fetching viva voce', error: error.message });
  }
};

module.exports = {
  uploadVivaVoce,
  getVivaVoce,
  upload
}; 