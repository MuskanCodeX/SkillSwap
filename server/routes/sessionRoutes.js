const express = require('express');
const router = express.Router();
const {
  createSessionRequest,
  getUserSessions,
  updateSessionStatus,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, createSessionRequest);
router.get('/my-sessions', protect, getUserSessions);
router.patch('/:sessionId/status', protect, updateSessionStatus);

module.exports = router;