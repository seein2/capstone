const express = require('express');
const diaryController = require('../controllers/diaryController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// 파이썬서버로 일기를 보내고 분석된 결과값을 받아 챗봇과 같이 응답해주는 라우터
router.post('/analyze', authenticateToken, diaryController.diaryController);

// 특정 날짜의 일기 조회
router.get('/diaries/:userId', authenticateToken, diaryController.getDiaryByDate);

// 전체 일기 목록 조회
router.get('/diaries', authenticateToken, diaryController.getAllDiaries);

// 일기 수정
router.put('/diaries/update/:diaryId', authenticateToken, diaryController.updateDiary);

// 일기 삭제
router.delete('/diaries/delete/:diaryId', authenticateToken, diaryController.deleteDiary);

module.exports = router;