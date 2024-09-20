const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// 사용자 정보 확인 (로그인된 사용자의 ID 및 권한 확인)
router.get('/user-info', profileController.getUserInfo);

// 프로필 정보 가져오기
router.get('/profile', profileController.getProfile);

// 프로필 설정 페이지 렌더링
router.get('/profile/setup', profileController.getProfileSetup);

// 프로필 설정 처리 라우터
router.post('/profile/setup', profileController.setupProfile);

// 프로필 수정 라우터
router.put('/profile/edit', profileController.editProfile);

module.exports = router;