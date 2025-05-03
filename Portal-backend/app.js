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
const vivaVoceRoutes = require("./routes/vivaVoceRoutes");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const pdfRoutes = require('./routes/pdfRoutes');
const finalProjectRoutes = require('./routes/finalProjectRoutes'); // Import the final project routes

const app = express();

// Connect to Database
connectDB();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer with Cloudinary storage for weekly submissions
const weeklyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'weekly_submissions',
    allowed_formats: ['pdf', 'doc', 'docx', 'zip', 'rar']
  }
});

const weeklyUpload = multer({
  storage: weeklyStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx|zip|rar/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, DOCX, ZIP, and RAR files are allowed for weekly submissions'));
  }
});

// Configure Multer with Cloudinary storage for final reports
const finalReportStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'final_reports',
    allowed_formats: ['pdf', 'doc', 'docx', 'zip', 'rar'],
    // You might want a different folder for final reports
  }
});

const finalReportUpload = multer({
  storage: finalReportStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for final reports
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx|zip|rar/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, DOCX, ZIP, and RAR files are allowed for final reports'));
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
app.use("/api/viva-voce", vivaVoceRoutes);
app.use('/api/pdf', pdfRoutes);
const referenceRoutes = require('./routes/reference');
app.use('/api/reference', referenceRoutes);
app.use('/api/final-reports', finalProjectRoutes); // Mount the final project routes
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the finalReportUpload middleware if you need to use it in your finalProjectRoutes
module.exports = { finalReportUpload };