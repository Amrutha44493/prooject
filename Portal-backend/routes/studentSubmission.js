const express = require("express");
const router = express.Router();
const Student = require("../models/studentData");


router.get("/getSubmission/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ weeklySubmissionData: student.weeklySubmissionData ,
      finalProjectReport : student.finalProjectReport,
      vivaVoce: student.vivaVoce
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;