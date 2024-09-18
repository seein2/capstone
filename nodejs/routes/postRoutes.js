const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { ensureAuthenticated } = require('../middleware/authMiddleware'); // 미들웨어 추가

// 게시물 작성
router.post('/create', postController.createPost);

// 게시물 목록 조회 (페이징 적용)
router.get('/posts',  postController.getAllPostsWithPaging);

// 게시물 수정
router.put('/posts/:id', postController.updatePost);

// 게시글 삭제
router.delete('/posts/:id', postController.deletePost);

// 게시물 좋아요 추가/취소
router.post('/posts/:id/like', postController.toggleLikePost);

// 내가 작성한 게시물 목록 조회
router.get('/my-posts', postController.getMyPosts);

// 게시물 검색
router.get('/posts/search', postController.searchPosts);

module.exports = router;