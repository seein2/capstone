const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');
const { authenticateToken } = require('../middleware/authMiddleware');


router.post('/',authenticateToken, recommendController.getRecommendations);

router.get('/getrecommend', authenticateToken, recommendController.getLatestRecommendations);

module.exports = router;