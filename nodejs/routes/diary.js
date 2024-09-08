const express = require('express');
const { diaryController } = require('../controllers/diary');

const router = express.Router();

router.post('/analyze', diaryController)

module.exports = router;