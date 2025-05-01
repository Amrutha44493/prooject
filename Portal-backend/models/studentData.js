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

const projectReportSchema = mongoose.Schema({
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const vivaVoceSchema = mongoose.Schema({
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
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
  weeklySubmissionData: [
    weeklySubmissionSchema
  ],
  projectReport: {
    type: projectReportSchema,
    default: null
  },
  vivaVoce: {
    type: vivaVoceSchema,
    default: null
  }
});

const studentData = mongoose.model("student", studentSchema);
module.exports = studentData;
