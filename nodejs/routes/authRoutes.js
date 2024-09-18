const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // 컨트롤러 불러오기
const { ensureAuthenticated } = require('../middleware/authMiddleware'); // 미들웨어

// 카카오 인증 후 사용자 정보를 저장하는 경로
router.post('/kakao/callback', authController.kakaoCallback);


// 새로운 토큰 검증 라우트 추가
router.post('/verify-token', authController.verifyToken);

// 로그아웃 처리
router.post('/logout', authController.logout);

// 회원탈퇴 라우터
router.delete('/delete-account', ensureAuthenticated, authController.deleteAccount);

module.exports = router;