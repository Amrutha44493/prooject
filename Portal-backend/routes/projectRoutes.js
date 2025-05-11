const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const Project = require("../models/Projectlist");
const Student = require("../models/studentData");

const auth = require('../middleware/auth'); 
// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded.student;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

router.post("/add", verifyToken, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all projects
router.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student selects a project
router.post('/select/:projectId', verifyToken, async (req, res) => {
  try {
    const studentId = req.student.id;
    const projectId = req.params.projectId;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.projectSelected) {
      return res.status(400).json({ message: "You have already selected a project." });
    }

    student.projectSelected = projectId;
    await student.save();

    res.status(200).json({ message: "Project selected successfully." });
  } catch (err) {
    console.error("Project selection failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get selected project ID for logged-in student
router.get("/student/selected-project", verifyToken, async (req, res) => {
  try {
    const studentId = req.student.id;

    const student = await Student.findById(studentId);

    if (!student || !student.projectSelected) {
      return res.status(200).json({ projectId: null });
    }

    res.status(200).json({ projectId: student.projectSelected });
  } catch (error) {
    console.error("Error fetching selected project:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get full project details using project ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error('Error fetching project details:', err.message);
    res.status(500).send('Server Error');
  }
});

router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student || !student.projectSelected) {
      return res.status(404).json({ message: 'Student or selected project not found.' });
    }

    const project = await Project.findById(student.projectSelected);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error('Error fetching project for student:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get the end date of a specific project
router.get('/project/:projectId/end-date', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ endDate: project.endDate });
  } catch (err) {
    console.error('Error fetching end date:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
