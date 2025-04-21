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
  }
});

const projectlist = mongoose.model("Projectlist", projectlistSchema);
module.exports = projectlist