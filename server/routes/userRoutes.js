const express = require('express');
const router = express.Router();
const { searchUsersBySkill, getSwapMatches } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', searchUsersBySkill);
router.get('/matches', protect, getSwapMatches);

module.exports = router;