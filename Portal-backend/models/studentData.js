const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  projectSelected: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projectlist',
    default: null
  },
});

const studentData = mongoose.model("student", studentSchema); 
module.exports = studentData;