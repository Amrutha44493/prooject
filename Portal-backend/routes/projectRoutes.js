const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
router.use(express.json())
router.use(express.urlencoded({extended:true}))
const Project = require("../models/Projectlist");
const StudentProject = require("../models/StudentProject");


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



// Add dummy project

router.post("/add",verifyToken, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Get all projects
router.get("/",verifyToken,async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to allow a student to select a project (stores studentID and projectID)
router.post('/select/:projectId', verifyToken, async (req, res) => {
  try {
    const studentId = req.student.id; 
    const projectId = req.params.projectId;

    const existing = await StudentProject.findOne({ studentId });

    if (existing) {
      return res.status(400).json({ message: "You have already selected a project." });
    }

    const newSelection = new StudentProject({ studentId, projectId });
    await newSelection.save();

    res.status(200).json({ message: "Project selected successfully." });
  } catch (err) {
    console.error("Project selection failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get the selected project ID for the logged-in student
router.get("/student/selected-project", verifyToken, async (req, res) => {
  try {
    const studentId = req.student.id;

    const selected = await StudentProject.findOne({ studentId });

    if (!selected) {
      return res.status(200).json({ projectId: null });
    }

    res.status(200).json({ projectId: selected.projectId });
  } catch (error) {
    console.error("Error fetching selected project:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Route to get full project details using project ID (used in overview.jsx)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;