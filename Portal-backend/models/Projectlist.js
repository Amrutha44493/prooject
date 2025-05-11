const mongoose = require("mongoose");

const referenceMaterialSchema = new mongoose.Schema({
  title: String,
  description: String,
  week: Number,
  fileUrl: String,
  submissionType: {
    type: String,
    enum: ["link", "file"],
  },
  link: String,
  cloudinaryUrl: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});
const projectlistSchema = mongoose.Schema({
  title: String,
  frontend: String,
  backend: String,
  fullDesc: {
    overview: String,
    technologies: String,
    features: String,
    objective: String,
  }
  ,
  endDate: {
    type: Date,
    required: true,
  },
  referenceMaterials: [referenceMaterialSchema], 
});
const projectlist = mongoose.model("Projectlist", projectlistSchema);
module.exports = projectlist