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

// router.get("/student/selected-project", verifyToken, async (req, res) => {
//   const studentId = req.student.id; 

//   try {
//     const record = await StudentProject.findOne({ studentId });
//     if (record) {
//       res.json({ projectId: record.projectId });
//     } else {
//       res.json({ projectId: null });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error checking selected project" });
//   }
// });
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




module.exports = router;