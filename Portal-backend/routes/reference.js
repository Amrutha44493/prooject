const express = require('express');
const router = express.Router();
const ReferenceMaterial = require('../models/ReferenceMaterial');

// Get materials by week
router.get('/week/:week', async (req, res) => {
  try {
    const materials = await ReferenceMaterial.find({ week: req.params.week });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});
router.get('/weeks', async (req, res) => {
    try {
      const weeks = await ReferenceMaterial.distinct("week");
      res.json(weeks); 
    } catch (error) {
      console.error("Error fetching weeks:", error);
      res.status(500).json({ message: 'Error fetching weeks' });
    }
  });
  

module.exports = router;
