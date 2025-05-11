const express = require('express');
const router = express.Router();
const Projectlist = require('../models/Projectlist'); 

router.get('/weeks/:projectId', async (req, res) => {
  try {
    const project = await Projectlist.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const weeks = [...new Set(project.referenceMaterials.map(item => item.week))];

    res.json(weeks);
  } catch (error) {
    console.error("Error fetching weeks:", error);
    res.status(500).json({ message: 'Error fetching weeks' });
  }
});
router.get("/:projectId", async (req, res) => {
  try {
    const project = await Projectlist.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const referenceMaterials = project.referenceMaterials;

    if (!referenceMaterials || referenceMaterials.length === 0) {
      return res.status(404).json({ message: "No reference materials found for this project" });
    }

    res.json({ referenceMaterials }); // 
  } catch (error) {
    console.error("Error fetching reference materials:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
