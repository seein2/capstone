const db = require('../config/db');

// 게시물 정보 가져오기
class Post {
  static getAllWithPaging(page, limit, userId) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      const sql = `
        SELECT posts.*, users.community_nickname,
            (SELECT COUNT(*) FROM post_likes WHERE postId = posts.id) AS likeCount,
            (SELECT COUNT(*) FROM post_likes WHERE postId = posts.id AND userId = ?) AS isLiked,
            (SELECT COUNT(*) FROM comments WHERE postId = posts.id) AS commentCount
        FROM posts
        JOIN users ON posts.userId = users.id
        ORDER BY posts.created_at DESC
        LIMIT ? OFFSET ?;
      `;
      db.query(sql, [userId, limit, offset], (err, results) => {
        if (err) return reject(err);

        const countSql = 'SELECT COUNT(*) AS totalPosts FROM posts';
        db.query(countSql, (countErr, countResults) => {
          if (countErr) return reject(countErr);

          const totalPosts = countResults[0].totalPosts;
          const totalPages = Math.ceil(totalPosts / limit);

          resolve({
            posts: results.map(post => ({
              ...post,
              isLiked: post.isLiked > 0, // 좋아요 여부를 boolean으로 반환
            })),
            totalPosts,
            totalPages,
            currentPage: page
          });
        });
      });
    });
  }

  // 게시물 ID로 게시물 찾기 (이것도 필요한가?)
  static findById(postId) {
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
  }

  // 게시물 생성
  static create(data) {
    return new Promise((resolve, reject) => {
      const { title, content, userId } = data;
      const sql = 'INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)';
      db.query(sql, [title, content, userId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  // 게시물 수정
  static update(postId, userId, title, content, isAdmin) {
    return new Promise((resolve, reject) => {
      const checkSql = 'SELECT userId FROM posts WHERE id = ?';
      db.query(checkSql, [postId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          const postOwnerId = results[0]?.userId;
          if (postOwnerId !== userId && !isAdmin) {
            resolve({ message: '게시물 수정 권한이 없습니다.', status: 403 });
            // resolve : 비동기 작업에서 promise가 완료되었을 때 호출 (결과 전달)

          } else {
            const updateSql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
            db.query(updateSql, [title, content, postId], (err) => {
              if (err) {
                reject(err);
                // reject : promise에서 오류가 발생했을 때 호출 (오류 전달)
              } else {
                resolve({ message: '게시물이 수정되었습니다.', status: 200 });
              }
            });
          }
        }
      });
    });
  }

  // 게시물 삭제
  static delete(postId, userId, isAdmin) {
    return new Promise((resolve, reject) => {
      const checkSQL = 'SELECT userId FROM posts WHERE id = ?';
      db.query(checkSQL, [postId], (err, results) => {
        if (err) reject(err);
        else {
          if (results.length == 0) {
            resolve({ message: '게시글을 찾을 수 없습니다.', status: 404 });
          } else {
            const postOwnerId = results[0].userId;
            if (postOwnerId === userId || isAdmin) {
              const deleteSql = 'DELETE FROM posts WHERE id = ?';
              db.query(deleteSql, [postId], (deleteErr) => {
                if (deleteErr) reject(deleteErr);
                else resolve({ message: '게시글이 성공적으로 삭제되었습니다.' });
              });
            } else {
              resolve({ message: '게시글 삭제 권한이 없습니다.', status: 404 });
            }
          }
        }
      });
    });
  }

  // 게시물 좋아요 추가
  static like(postId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO post_likes (postId, userId) VALUES (?, ?)';
      db.query(sql, [postId, userId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  // 게시물 좋아요 취소
  static unlike(postId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM post_likes WHERE postId = ? AND userId = ?';
      db.query(sql, [postId, userId], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  // 사용자가 해당 게시물에 이미 좋아요를 눌렀는지 확인
  static checkIfLiked(postId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM post_likes WHERE postId = ? AND userId = ?';
      db.query(sql, [postId, userId], (err, results) => {
        if (err) reject(err);
        resolve(results.length > 0); // 좋아요가 존재하면 true 반환
      });
    });
  }

  static async toggleLike(postId, userId) {
    const liked = await this.checkIfLiked(postId, userId);
    if (liked) {
      await this.unlike(postId, userId);
      return { message: '좋아요 취소', action: 'unliked' };
    } else {
      await this.like(postId, userId);
      return { message: '좋아요', actions: 'liked' };
    }
  }



  // 좋아요 수 조회 (필요한가?)
  // static getLikeCount(postId) {
  //   return new Promise((resolve, reject) => {
  //     const sql = 'SELECT COUNT(*) AS likeCount FROM post_likes WHERE postId = ?';
  //     db.query(sql, [postId], (err, result) => {
  //       if (err) reject(err);
  //       resolve(result[0].likeCount);
  //     });
  //   });
  // }

  static getMyPosts(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT posts.*, 
            users.community_nickname,
            (SELECT COUNT(*) FROM post_likes WHERE post_likes.postId = posts.id) AS likeCount
        FROM posts
        JOIN users ON posts.userId = users.id
        WHERE posts.userId = ?
        ORDER BY posts.created_at DESC
    `;
      db.query(sql, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    })
  }

  static search(keyword) {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT *, users.community_nickname
      FROM posts
      JOIN users ON posts.userId = users.id
      WHERE title LIKE ? OR content LIKE ?
      ORDER BY created_at DESC
      `;
      const searchKeyword = `%${keyword}%`;
      db.query(sql, [searchKeyword, searchKeyword], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }


  static getOwner(postId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT users.fcmToken FROM posts JOIN users ON posts.userId = users.id WHERE posts.id = ?';
      db.query(sql, [postId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);  // 게시물 소유자의 FCM 토큰 반환
      });
    });
  }
}

module.exports = Post;
