const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middleware/authMiddleware');  // authMiddleware에서 authenticateToken 가져오기

// 게시물 작성
router.post('/create', authenticateToken, postController.createPost);

// 게시물 목록 조회 (페이징 적용)
router.get('/posts', authenticateToken, postController.getAllPostsWithPaging);

// 게시물 수정
router.put('/posts/:id', authenticateToken, postController.updatePost);

// 게시글 삭제
router.delete('/posts/:id', authenticateToken, postController.deletePost);

// 게시물 좋아요 추가/취소
router.post('/posts/:id/like', authenticateToken, postController.toggleLikePost);

// 내가 작성한 게시물 목록 조회
router.get('/my-posts', authenticateToken, postController.getMyPosts);

// 게시물 검색
router.get('/posts/search', authenticateToken, postController.searchPosts);

module.exports = router;
