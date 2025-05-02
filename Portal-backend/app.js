require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const connectDB = require("./db/connection");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projectRoutes");
const weeklySubmissionRoutes = require("./routes/weeklySubmissionRoutes");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const pdfRoutes = require("./routes/pdfRoutes");
const queryRoutes = require("./routes/queryRoutes");
const vivaVoceRoutes = require("./routes/vivaVoceRoutes");

const app = express();

// Connect to Database
connectDB();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "weekly_submissions",
    allowed_formats: ["pdf", "doc", "docx", "zip", "rar"],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx|zip|rar/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, DOC, DOCX, ZIP, and RAR files are allowed"));
  },
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define Routes
const basicRoutes = require("./routes/studentRoutes");
app.use("/signup", basicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/weekly-submissions", weeklySubmissionRoutes);
app.use('/api/pdf', pdfRoutes);
app.use("/api/viva-voce", vivaVoceRoutes);
const referenceRoutes = require('./routes/reference');
app.use('/api/reference', referenceRoutes);
app.use('/api/forum', queryRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
