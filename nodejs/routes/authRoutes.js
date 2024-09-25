const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // 컨트롤러 불러오기
const { authenticateToken } = require('../middleware/authMiddleware'); // 미들웨어

// 카카오 인증 후 사용자 정보를 저장하는 경로
router.post('/kakao/callback', authController.kakaoCallback);

// 토큰 검증 라우트
router.post('/verify-token', authenticateToken, authController.verifyToken);

// 로그아웃 처리
router.post('/logout', authenticateToken, authController.logout);

// 회원탈퇴 라우터
router.delete('/delete-account', authenticateToken, authController.deleteAccount);

module.exports = router;