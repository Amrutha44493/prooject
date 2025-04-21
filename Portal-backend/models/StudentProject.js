const mongoose = require("mongoose");

const studentProjectSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projectlist",
    required: true
  }
});

module.exports = mongoose.model("StudentProject", studentProjectSchema);
