const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');
const { authenticateToken } = require('../middleware/authMiddleware');


router.post('/recommend',authenticateToken, recommendController.getRecommendations);