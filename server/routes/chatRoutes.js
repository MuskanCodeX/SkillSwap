const express = require('express');
const router = express.Router();
const { getSessionMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:sessionId', protect, getSessionMessages);

module.exports = router;