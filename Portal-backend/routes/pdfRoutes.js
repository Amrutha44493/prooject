const express = require('express');
const router = express.Router();
const { generateProjectPDF } = require('../controllers/pdfController');

router.get('/generate-pdf/:projectId', generateProjectPDF);

module.exports = router;
