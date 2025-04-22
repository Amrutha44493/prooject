const mongoose = require("mongoose");
const weeklySubmissionSchema = mongoose.Schema({
  student_id: String,
  comment: String,
  link: String,
});

const weeklySubmissionData = mongoose.model("weeklysubmission", weeklySubmissionSchema); 
module.exports = weeklySubmissionData;