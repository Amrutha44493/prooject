const mongoose = require("mongoose");
const ReferenceMaterial = require("./ReferenceMaterial");
// const weeklySubmissionData = require("./weeklySubmissionData");
const weeklySubmissionSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  submissionType: {
    type: String,
    enum: ["link", "file"],
    required: true,
  },
  link: {
    type: String,
    required: function () {
      return this.submissionType === "link";
    },
  },
  cloudinaryUrl: {
    type: String,
    required: function () {
      return this.submissionType === "file";
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const studentSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  projectSelected: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projectlist",
    default: null,
  },
  weeklySubmissionData:[
    weeklySubmissionSchema
  ]
});

const studentData = mongoose.model("student", studentSchema);
module.exports = studentData;
