const db = require('../config/db');

const Comment = {
  // 특정 게시물의 모든 댓글을 가져오기 (작성자 닉네임 및 좋아요 수 포함)
  getAllByPostId: (postId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT comments.*, users.community_nickname,
          (SELECT COUNT(*) FROM comment_likes WHERE commentId = comments.id) AS likeCount
        FROM comments
        JOIN users ON comments.userId = users.id
        WHERE comments.postId = ?
        ORDER BY comments.createdAt ASC
      `;
      db.query(sql, [postId], (err, results) => {
        if (err) return reject(err);
        resolve(results);  // 댓글과 함께 likeCount를 반환
      });
    });
  },

  // 댓글 ID로 댓글 찾기
  findById: (commentId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM comments WHERE id = ?';
      db.query(sql, [commentId], (err, results) => {
        if (err) return reject(err);
        if (results.length > 0) {
          resolve(results[0]); // 댓글이 존재하면 반환
        } else {
          resolve(null); // 댓글이 없으면 null 반환
        }
      });
    });
  },

  // 댓글 생성
  create: (data) => {
    return new Promise((resolve, reject) => {
      const { content, postId, userId } = data;
      const sql = 'INSERT INTO comments (content, postId, userId) VALUES (?, ?, ?)';
      db.query(sql, [content, postId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // 댓글 수정
  update: (commentId, content, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE comments SET content = ? WHERE id = ? AND userId = ?';
      db.query(sql, [content, commentId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // 댓글 삭제 (댓글 작성자 또는 관리자가 삭제 가능)
  delete: (commentId) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM comments WHERE id = ?';
      db.query(sql, [commentId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },


  // 댓글 좋아요 추가
  like: (commentId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO comment_likes (commentId, userId) VALUES (?, ?)';
      db.query(sql, [commentId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // 댓글 좋아요 취소
  unlike: (commentId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM comment_likes WHERE commentId = ? AND userId = ?';
      db.query(sql, [commentId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // 사용자가 해당 댓글에 이미 좋아요를 눌렀는지 확인
  checkIfLiked: (commentId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM comment_likes WHERE commentId = ? AND userId = ?';
      db.query(sql, [commentId, userId], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0); // 좋아요가 존재하면 true 반환
      });
    });
  },


  // 댓글 좋아요 수 조회
  getLikeCount: (commentId) => {
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
