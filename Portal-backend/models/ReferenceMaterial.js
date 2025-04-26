const mongoose = require('mongoose');

const ReferenceMaterialSchema = new mongoose.Schema({
  title: String,
  description: String,
  week: Number,
  fileUrl: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('refermaterial', ReferenceMaterialSchema);
