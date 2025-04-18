const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
router.use(express.json())
router.use(express.urlencoded({extended:true}))
const Project = require("../models/Projectlist");


// function verifytoken(req,res,next){
//   const token = req.headers.token
//   try{
//      if (!token) throw "unauthorized access"
//      const payload = jwt.verify(token,"student")
//      if(!payload) throw "unauthorized access"
//      next()
//   }catch(error){
//      res.status(404).send(error)
//   }
//  }
function verifytoken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
  
    try {
      if (!token) throw "Unauthorized access";
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload.student.id; 
      next();
    } catch (error) {
      res.status(401).send({ message: error });
    }
  }
// Add dummy project

router.post("/add",verifytoken, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Get all projects
router.get("/",verifytoken,async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/select/:projectId", verifytoken, async (req, res) => {
    const projectId = req.params.projectId;
    const studentId = req.userId;
  
    try {
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).send({ message: "Project not found" });
  
      if (project.selectedBy) {
        return res.status(400).send({ message: "Project already selected" });
      }
  
      project.selectedBy = studentId; 
      await project.save();
  
      res.status(200).send({ message: "Project selected successfully", project });
    } catch (error) {
      res.status(500).send({ message: "Server error", error });
    }
  });
  
// router.post("/select/:projectId", verifytoken, async (req, res) => {
//   const projectId = req.params.projectId;
//   const studentEmail = req.user.email;

//   try {
//     const project = await Project.findById(projectId);

//     if (!project) return res.status(404).send({ message: "Project not found" });

//     if (project.selectedBy) {
//       return res.status(400).send({ message: "Project already selected" });
//     }

//     project.selectedBy = studentEmail;
//     await project.save();

//     res.status(200).send({ message: "Project selected successfully", project });
//   } catch (error) {
//     res.status(500).send({ message: "Server error", error });
//   }
// });


module.exports = router;