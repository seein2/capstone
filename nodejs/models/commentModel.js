const db = require('../config/db');

class Comment {
  // 특정 게시물의 모든 댓글을 가져오기 (작성자 닉네임 및 좋아요 수 포함)
  static getAllByPostId(postId, userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT comments.*, users.community_nickname, users.community_icon,
          (SELECT COUNT(*) FROM comment_likes WHERE commentId = comments.id AND userId = ?) AS isLiked,
          (SELECT COUNT(*) FROM comment_likes WHERE commentId = comments.id) AS likeCount
        FROM comments
        JOIN users ON comments.userId = users.id
        WHERE comments.postId = ?
        ORDER BY comments.createdAt DESC
      `;
      db.query(sql, [userId, postId], (err, results) => {
        if (err) return reject(err);
        resolve(results.map(comment => ({
          ...comment,
          isLiked: comment.isLiked > 0  // 좋아요 여부를 boolean으로 반환
        })));
      });
    });
  }


  // 댓글 ID로 댓글 찾기
  static findById(commentId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM comments WHERE id = ?';
      db.query(sql, [commentId], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  }

  // 댓글 생성
  static create(data) {
    return new Promise((resolve, reject) => {
      const { content, postId, userId } = data;
      const sql = 'INSERT INTO comments (content, postId, userId) VALUES (?, ?, ?)';
      db.query(sql, [content, postId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // 댓글 수정
  static update(commentId, content, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE comments SET content = ? WHERE id = ? AND userId = ?';
      db.query(sql, [content, commentId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // 댓글 삭제 (댓글 작성자 또는 관리자가 삭제 가능)
  static delete(commentId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM comments WHERE id = ?';
      db.query(sql, [commentId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }


  // 댓글 좋아요 추가
  static like(commentId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO comment_likes (commentId, userId) VALUES (?, ?)';
      db.query(sql, [commentId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // 댓글 좋아요 취소
  static unlike(commentId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM comment_likes WHERE commentId = ? AND userId = ?';
      db.query(sql, [commentId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // 사용자가 해당 댓글에 이미 좋아요를 눌렀는지 확인
  static checkIfLiked(commentId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM comment_likes WHERE commentId = ? AND userId = ?';
      db.query(sql, [commentId, userId], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0); // 좋아요가 존재하면 true 반환
      });
    });
  }


  // 댓글 좋아요 수 조회
  static getLikeCount(commentId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) AS likeCount FROM comment_likes WHERE commentId = ?';
      db.query(sql, [commentId], (err, result) => {
        if (err) {
          console.error('DB 쿼리 오류:', err);
          return reject(err);
        }
        resolve(result[0].likeCount); // likeCount 반환
      });
    });
  }
}



module.exports = Comment;
