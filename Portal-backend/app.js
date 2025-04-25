require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const connectDB = require('./db/connection');
const authRoutes = require('./routes/auth');
const projectRoutes = require("./routes/projectRoutes");
const weeklySubmissionRoutes = require("./routes/weeklySubmissionRoutes");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// Connect to Database
connectDB();

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
    folder: 'weekly_submissions',
    allowed_formats: ['pdf', 'doc', 'docx', 'zip', 'rar']
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx|zip|rar/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, DOCX, ZIP, and RAR files are allowed'));
  }
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define Routes
const basicRoutes = require('./routes/studentRoutes');
app.use("/signup", basicRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/weekly-submissions", weeklySubmissionRoutes);

// Project submission routes
app.post('/api/projects/:projectId/submit', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const projectId = req.params.projectId;
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const fileType = path.extname(fileName).toLowerCase();

    // Here you would typically save this information to your database
    // along with the student's ID and submission timestamp

    res.status(200).json({
      message: 'Project submitted successfully',
      file: {
        name: fileName,
        size: fileSize,
        type: fileType,
        path: filePath
      }
    });
  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({ message: 'Error submitting project', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));