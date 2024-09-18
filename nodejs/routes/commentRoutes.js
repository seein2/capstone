const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// 댓글 조회 라우터
router.get('/posts/:postId/comments', commentController.getCommentsByPostId);

// 댓글 생성 라우터
router.post('/posts/:postId/comments', commentController.createComment);

// 댓글 삭제 라우터
router.delete('/comments/:id', commentController.deleteComment);

// 댓글 좋아요 추가/취소 라우터
router.post('/comments/:id/like', commentController.likeComment);

// 댓글 수정 라우터
router.put('/comments/:id', commentController.updateComment);

module.exports = router;