const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const db = require('../config/db');
const { sendPushNotification } = require('../services/notificationService');

// 댓글 조회
exports.getCommentsByPostId = (req, res) => {
  const postId = req.params.postId;

  const sql = `
        SELECT comments.*, 
               users.community_nickname AS nickname,
               (SELECT COUNT(*) FROM comment_likes WHERE commentId = comments.id) AS likeCount
        FROM comments
        JOIN users ON comments.userId = users.id  -- 댓글 작성자 정보 포함
        WHERE comments.postId = ?
        ORDER BY comments.createdAt DESC;
    `;

  db.query(sql, [postId], (err, results) => {
    if (err) {
      console.error('댓글 조회 중 오류:', err);
      return res.status(500).json({ error: '댓글 조회 중 오류가 발생했습니다.' });
    }
    res.json(results);  // 댓글 목록 및 likeCount 반환
  });
};

// 댓글 생성
exports.createComment = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;

  try {
    // 댓글 생성
    const result = await Comment.create({ content, postId, userId });

    // 게시물 작성자의 FCM 토큰을 가져오기
    const postOwner = await Post.getOwner(postId);
    const fcmToken = postOwner.fcmToken;

    // 푸시 알림 보내기
    if (fcmToken) {
      sendPushNotification(fcmToken, '새 댓글 알림', '게시물에 새로운 댓글이 달렸습니다.');
    }

    res.json({ message: '댓글 생성 완료', commentId: result.insertId });
  } catch (error) {
    console.error('댓글 생성 오류:', error);
    res.status(500).json({ error: '댓글 생성 중 오류 발생' });
  }
};

// 댓글 삭제
exports.deleteComment = (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  // 해당 댓글이 작성된 사용자인지 확인
  const sql = 'SELECT userId FROM comments WHERE id = ?';
  db.query(sql, [commentId], (err, results) => {
    if (err) {
      console.error('댓글 조회 중 오류:', err);
      return res.status(500).json({ error: '댓글 조회 중 오류가 발생했습니다.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    const commentOwnerId = results[0].userId;

    // 작성자 본인이나 관리자인 경우에만 삭제 가능
    if (commentOwnerId === userId || req.user.isAdmin) {
      Comment.delete(commentId)
        .then(() => res.json({ message: '댓글이 성공적으로 삭제되었습니다.' }))
        .catch(deleteErr => {
          console.error('댓글 삭제 중 오류:', deleteErr);
          return res.status(500).json({ error: '댓글 삭제 중 오류가 발생했습니다.' });
        });
    } else {
      return res.status(403).json({ message: '댓글 삭제 권한이 없습니다.' });
    }
  });
};

// 댓글 좋아요 추가/취소
exports.likeComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  try {
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
exports.updateComment = (req, res) => {
  const commentId = req.params.id;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ error: '댓글 내용을 입력하세요.' });
  }

  Comment.update(commentId, content, userId)
    .then(result => {
      if (result.affectedRows === 0) {
        return res.status(403).json({ error: '댓글 수정 권한이 없습니다.' });
      }
      res.json({ success: true });
    })
    .catch(err => {
      console.error('댓글 수정 중 오류:', err);
      res.status(500).json({ error: '댓글 수정 중 오류가 발생했습니다.' });
    });
};
