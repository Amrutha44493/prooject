const mongoose = require("mongoose");

const projectlistSchema = mongoose.Schema({
  title: String,
  frontend: String,
  backend: String,
  fullDesc: {
    overview: String,
    technologies: String,
    features: String,
    objective: String,
  },
  selectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
    default: null,
  }
});

const projectlist = mongoose.model("Projectlist", projectlistSchema);
module.exports = projectlist