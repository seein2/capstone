const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');
const { authenticateToken } = require('../middleware/authMiddleware');


router.post('/',authenticateToken, recommendController.getRecommendations);

module.exports = router;