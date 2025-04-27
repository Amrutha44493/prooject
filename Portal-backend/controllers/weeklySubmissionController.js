// // const weeklySubmissionData = require('../models/weeklySubmissionData');
// const weeklySubmissionData = require('../models/studentData')
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Configure Multer with Cloudinary storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'weekly_submissions',
//     allowed_formats: ['pdf', 'doc', 'docx', 'zip', 'rar'],
//     resource_type: 'auto',
//     transformation: [{ quality: 'auto' }]
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-rar-compressed'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only PDF, DOC, DOCX, ZIP, and RAR files are allowed.'));
//     }
//   }
// });

// // Handle file upload and create submission
// const createSubmission = async (req, res) => {
//   try {
//     console.log('Request body:', req.body);
//     console.log('Request file:', req.file);
    
//     const { student_id, comment, link } = req.body;
    
//     if (!student_id || !comment) {
//       console.log('Missing required fields:', { student_id, comment });
//       return res.status(400).json({ 
//         message: 'Student ID and comment are required',
//         details: { student_id: !student_id ? 'Missing' : 'Provided', comment: !comment ? 'Missing' : 'Provided' }
//       });
//     }

//     let submissionData = {
//       student_id,
//       comment,
//       submissionType: 'link',
//       createdAt: new Date()
//     };

//     // If file is uploaded
//     if (req.file) {
//       console.log('File upload details:', {
//         path: req.file.path,
//         originalname: req.file.originalname,
//         mimetype: req.file.mimetype,
//         size: req.file.size
//       });
      
//       submissionData.cloudinaryUrl = req.file.path;
//       submissionData.submissionType = 'file';
//       submissionData.fileName = req.file.originalname;
//     } else if (link) {
//       submissionData.link = link;
//     } else {
//       console.log('No file or link provided');
//       return res.status(400).json({ 
//         message: 'Either a file or link must be provided',
//         details: { file: req.file ? 'Provided' : 'Missing', link: link ? 'Provided' : 'Missing' }
//       });
//     }

//     console.log('Saving submission data:', submissionData);
//     const submission = new weeklySubmissionData(submissionData);
//     await submission.save();

//     res.status(201).json({
//       message: 'Submission created successfully',
//       submission: {
//         id: submission._id,
//         student_id: submission.student_id,
//         comment: submission.comment,
//         submissionType: submission.submissionType,
//         link: submission.link,
//         cloudinaryUrl: submission.cloudinaryUrl,
//         fileName: submission.fileName,
//         createdAt: submission.createdAt
//       }
//     });
//   } catch (error) {
//     console.error('Error creating submission:', error);
//     console.error('Error stack:', error.stack);
    
//     // Handle specific error cases
//     if (error.message.includes('Invalid file type')) {
//       return res.status(400).json({ 
//         message: error.message,
//         details: { error: 'Invalid file type' }
//       });
//     }
    
//     if (error.message.includes('File too large')) {
//       return res.status(400).json({ 
//         message: 'File size exceeds 10MB limit',
//         details: { error: 'File too large' }
//       });
//     }

//     res.status(500).json({ 
//       message: 'Error creating submission',
//       error: error.message,
//       details: {
//         name: error.name,
//         code: error.code,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       }
//     });
//   }
// };

// // Get all submissions for a student
// const getStudentSubmissions = async (req, res) => {
//   try {
//     const { student_id } = req.params;
//     const submissions = await weeklySubmissionData.find({ student_id });
//     res.json(submissions);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching submissions', error: error.message });
//   }
// };

// module.exports = {
//   createSubmission,
//   getStudentSubmissions,
//   upload
// }; 

const weeklySubmissionData = require('../models/studentData'); // Student Model
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'weekly_submissions',
    allowed_formats: ['pdf', 'doc', 'docx', 'zip', 'rar'],
    resource_type: 'auto',
    transformation: [{ quality: 'auto' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/zip', 
      'application/x-rar-compressed'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, ZIP, and RAR files are allowed.'));
    }
  }
});

// Controller to create a submission
const createSubmission = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { student_id, comment, link } = req.body;

    if (!student_id || !comment) {
      return res.status(400).json({ 
        message: 'Student ID and comment are required'
      });
    }

    const student = await weeklySubmissionData.findById(student_id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Prepare new submission
    let newSubmission = {
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
      return res.status(400).json({ message: 'Either a file or a link must be provided' });
    }

    // Push the new submission into student's data
    student.weeklySubmissionData.push(newSubmission);
    await student.save();

    res.status(201).json({
      message: 'Submission created successfully',
      submission: newSubmission
    });
    
  } catch (error) {
    console.error('Error creating submission:', error);
    
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('File too large')) {
      return res.status(400).json({ message: 'File size exceeds 10MB limit' });
    }

    res.status(500).json({ message: 'Error creating submission', error: error.message });
  }
};

// Controller to get all submissions of a student
const getStudentSubmissions = async (req, res) => {
  try {
    const { student_id } = req.params;

    const student = await weeklySubmissionData.findById(student_id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student.weeklySubmissionData);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
};

module.exports = {
  createSubmission,
  getStudentSubmissions,
  upload
};
