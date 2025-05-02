const express = require('express');
const router = express.Router();
const { uploadVivaVoce, getVivaVoce, upload } = require('../controllers/vivaVoceController');
const auth = require('../middleware/auth');

// Upload viva voce
router.post('/upload', auth, upload.single('file'), uploadVivaVoce);

// Get viva voce submission
router.get('/', auth, getVivaVoce);

module.exports = router; 