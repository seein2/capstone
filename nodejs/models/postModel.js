const db = require('../config/db');

const Post = {
  getAllWithPaging: ({ limit, offset }) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT posts.*, users.community_nickname AS nickname,
            (SELECT COUNT(*) FROM post_likes WHERE postId = posts.id) AS likeCount
        FROM posts
        JOIN users ON posts.userId = users.id
        ORDER BY posts.created_at DESC
        LIMIT ? OFFSET ?;
      `;
      db.query(sql, [limit, offset], (err, results) => {
        if (err) return reject(err);

        const countSql = 'SELECT COUNT(*) AS totalPosts FROM posts';
        db.query(countSql, (countErr, countResults) => {
          if (countErr) return reject(countErr);

          const totalPosts = countResults[0].totalPosts;
          const totalPages = Math.ceil(totalPosts / limit);

          resolve({
            posts: results,
            totalPosts,
            totalPages
          });
        });
      });
    });
  },

  // 게시물 ID로 게시물 찾기
  findById: (postId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM posts WHERE id = ?';
      db.query(sql, [postId], (err, results) => {
        if (err) return reject(err);
        if (results.length > 0) {
          resolve(results[0]); // 게시물이 존재하면 반환
        } else {
          resolve(null); // 게시물이 없으면 null 반환
        }
      });
    });
  },

  // 게시물 생성
  create: (data) => {
    return new Promise((resolve, reject) => {
      const { title, content, userId } = data;
      const sql = 'INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)';
      db.query(sql, [title, content, userId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  // 게시물 수정
  update: (postId, data) => {
    const { title, content } = data;
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
      db.query(sql, [title, content, postId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  // 게시물 삭제
  delete: (postId, userId) => {
    return new Promise((resolve, reject) => {
      // 게시물 삭제 시 userId 체크 추가
      const sql = 'DELETE FROM posts WHERE id = ? AND userId = ?';
      db.query(sql, [postId, userId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  // 게시물 좋아요 추가
  like: (postId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO post_likes (postId, userId) VALUES (?, ?)';
      db.query(sql, [postId, userId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  // 게시물 좋아요 취소
  unlike: (postId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM post_likes WHERE postId = ? AND userId = ?';
      db.query(sql, [postId, userId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  // 사용자가 해당 게시물에 이미 좋아요를 눌렀는지 확인
  checkIfLiked: (postId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM post_likes WHERE postId = ? AND userId = ?';
      db.query(sql, [postId, userId], (err, results) => {
        if (err) reject(err);
        resolve(results.length > 0); // 좋아요가 존재하면 true 반환
      });
    });
  },

  // 좋아요 수 조회
  getLikeCount: (postId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT COUNT(*) AS likeCount FROM post_likes WHERE postId = ?';
      db.query(sql, [postId], (err, result) => {
        if (err) reject(err);
        resolve(result[0].likeCount);
      });
    });
  }
};

Post.getOwner = (postId) => {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT users.fcmToken FROM posts JOIN users ON posts.userId = users.id WHERE posts.id = ?';
      db.query(sql, [postId], (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);  // 게시물 소유자의 FCM 토큰 반환
      });
  });
};

module.exports = Post;
