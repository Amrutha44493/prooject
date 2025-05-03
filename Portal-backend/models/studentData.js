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
  marks: {
    type: Number,
    default: 0,
  },
  mentorComment: {
    type: String,
    default: "",
  },
});

// const projectReportSchema = mongoose.Schema({
//   cloudinaryUrl: {
//     type: String,
//     required: true,
//   },
//   fileName: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });
const finalProjectReport = mongoose.Schema({
  submissionType: {
    type: String,
    enum: ["link", "file"],
  },
  link: String,
  cloudinaryUrl: String,
  comments: String,
  submissionDate: {
    type: Date,
    default: null,
  },
  submissionStatus: { 
    type: Boolean,
    default: false,
  },
  marks: {
    type: Number,
    default: 0,
  },
  mentorComment: {
    type: String,
    default: "",
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projectlist',
  }
})

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
  marks: {
    type: Number,
    default: 0,
  },
  mentorComment: {
    type: String,
    default: "",
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
  // finalProjectReport: {
  //   submissionType: {
  //     type: String,
  //     enum: ["link", "file"],
  //   },
  //   link: String,
  //   cloudinaryUrl: String,
  //   comments: String,
  //   submissionDate: {
  //     type: Date,
  //     default: null,
  //   },
  //   submissionStatus: { 
  //     type: Boolean,
  //     default: false,
  //   },
  //   marks: {
  //     type: Number,
  //     default: 0,
  //   },
  //   mentorComment: {
  //     type: String,
  //     default: "",
  //   },
  //   projectId: { 
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Projectlist',
  //   }
  // },
  finalProjectReport :finalProjectReport,
vivaVoce: vivaVoceSchema
  
});


const studentData = mongoose.model("student", studentSchema);
module.exports = studentData;
