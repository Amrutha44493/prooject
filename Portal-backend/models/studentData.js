const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
});

const studentData = mongoose.model("student", studentSchema); 
module.exports = studentData;