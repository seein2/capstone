const express = require('express');
const { analyzeDiary } = require('../controllers/diary');

const router = express.Router();

router.post('/analyze', analyzeDiary)

module.exports = router;