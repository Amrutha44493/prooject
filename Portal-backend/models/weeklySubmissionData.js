const mongoose = require("mongoose");
const weeklySubmissionSchema = mongoose.Schema({
  student_id: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  submissionType: {
    type: String,
    enum: ['link', 'file'],
    required: true
  },
  link: {
    type: String,
    required: function() {
      return this.submissionType === 'link';
    }
  },
  cloudinaryUrl: {
    type: String,
    required: function() {
      return this.submissionType === 'file';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const weeklySubmissionData = mongoose.model("weeklysubmission", weeklySubmissionSchema); 
module.exports = weeklySubmissionData;