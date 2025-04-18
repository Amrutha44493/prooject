const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const studentModel = require("../models/studentData");

//post operation
router.post("/", async (req, res) => {
  try {
    var item = req.body;
    const data = new studentModel(item);
    await data.save();
    res.status(200).json({ message: "Successful" });
  } catch (error) {
    res.status(500).json({ message: "POST unsuccessful", error: error.message });
  }
});

module.exports = router;