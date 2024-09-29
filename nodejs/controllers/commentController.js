const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const { sendPushNotification } = require('../services/notificationService');

// 댓글 조회
exports.getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;  // 현재 사용자 ID
    const result = await Comment.getAllByPostId(postId, userId);  // userId 전달
    res.json(result);
  } catch (err) {
    console.error('댓글 조회 오류: ', err);
    res.status(500).json({ error: '댓글 조회 중 오류 발생' });
  }
};

// 댓글 생성
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.user.id;

    // 댓글 생성
    const result = await Comment.create({ content, postId, userId });
    // 게시물 작성자의 FCM 토큰을 가져오기
    const postOwner = await Post.getOwner(postId);

    // 푸시 알림 보내기
    if (postOwner && postOwner.fcmToken) {
      await sendPushNotification(postOwner.fcmToken, '새 댓글 알림', '게시물에 새로운 댓글이 달렸습니다.');
    }

    res.json({ message: '댓글 생성 완료', commentId: result.insertId });
  } catch (error) {
    console.error('댓글 생성 오류:', error);
    res.status(500).json({ error: '댓글 생성 중 오류 발생' });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const result = await Comment.findById(commentId);

    if (!result) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }
    // 작성자 본인이나 관리자인 경우에만 삭제 가능
    if (result.userId !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: '댓글 삭제 권한이 없습니다.' });
    }

    await Comment.delete(commentId);
    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    console.error('댓글 삭제 중 오류: ', error);
    res.status(500).json({ error: '댓글 삭제 중 오류' });
  }
};

// 댓글 좋아요 추가/취소
exports.likeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const liked = await Comment.checkIfLiked(commentId, userId);

    if (liked) {
      await Comment.unlike(commentId, userId);
    } else {
      await Comment.like(commentId, userId);
    }

    // 좋아요 수 계산
    const likeCount = await Comment.getLikeCount(commentId);
    res.json({ success: true, likeCount });
  } catch (error) {
    console.error('좋아요 처리 오류:', error);
    res.status(500).json({ success: false, message: '좋아요 처리 중 오류 발생' });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: '댓글 내용을 입력하세요.' });
    }

    const result = await Comment.update(commentId, content, userId)
    if (result.affectedRows === 0) {
      return res.status(403).json({ error: '댓글 수정 권한이 없습니다.' });
    }
    res.json({ success: true });

  } catch (err) {
    console.error('댓글 수정 중 오류:', err);
    res.status(500).json({ error: '댓글 수정 중 오류가 발생했습니다.' });
  }
};
