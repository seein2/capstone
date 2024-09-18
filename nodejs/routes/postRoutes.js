const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { ensureAuthenticated } = require('../middleware/authMiddleware'); // 미들웨어 추가

// 게시물 작성
router.post('/create', ensureAuthenticated, postController.createPost);

// 게시물 목록 조회 (페이징 적용)
router.get('/posts', ensureAuthenticated, postController.getAllPostsWithPaging);

// 게시물 수정
router.put('/posts/:id', ensureAuthenticated, postController.updatePost);

// 게시글 삭제
router.delete('/posts/:id', ensureAuthenticated, postController.deletePost);

// 게시물 좋아요 추가/취소
router.post('/posts/:id/like', ensureAuthenticated, postController.toggleLikePost);

// 내가 작성한 게시물 목록 조회
router.get('/my-posts', ensureAuthenticated, postController.getMyPosts);

// 게시물 검색
router.get('/posts/search', ensureAuthenticated, postController.searchPosts);

module.exports = router;
