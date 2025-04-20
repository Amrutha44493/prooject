const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const studentModel = require("../models/studentData");
const marksModel = require("../models/marksData");

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, password, mark } = req.body;

    console.log("Received data:", req.body); 

    const studentRecord = await marksModel.findOne({ email });

    if (!studentRecord) {
      return res.status(400).json({ message: "Email not authorized for signup" });
    }

    if (parseInt(studentRecord.mark) < 40) {
      return res.status(400).json({ message: "Not eligible to signup (Marks below 40)" });
    }

    if (parseInt(studentRecord.mark) !== parseInt(mark)) {
      return res.status(400).json({ message: "Entered marks do not match our records" });
    }
    
    const newUser = new studentModel({ name, email, phone, password, mark });
    await newUser.save();

    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error during signup:", error); 
    res.status(500).json({ message: "Signup Failed", error: error.message });
  }
});
module.exports = router;
