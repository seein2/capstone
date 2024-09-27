const Post = require('../models/postModel');
const db = require('../config/db');

// 게시물 작성
exports.createPost = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user ? req.user.id : null;

  if (!title || !content) {
    return res.status(400).json({ error: '제목과 내용을 입력해야 합니다.' });
  }

  // userId가 없는 경우 에러 처리
  if (!userId) {
    return res.status(400).json({ error: '로그인된 사용자만 게시물을 작성할 수 있습니다.' });
  }

  Post.create({ title, content, userId })
    .then(result => {
      res.json({ message: '게시물 작성 성공', postId: result.insertId });
    })
    .catch(err => {
      console.error('게시물 작성 오류:', err);
      res.status(500).json({ error: '게시물 작성 중 오류 발생' });
    });
};

// 게시물 목록 조회 (페이징 적용)
exports.getAllPostsWithPaging = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  Post.getAllWithPaging({ limit, offset })
    .then(data => {
      res.json({
        posts: data.posts,
        totalPosts: data.totalPosts,
        totalPages: data.totalPages,
        currentPage: page
      });
    })
    .catch(err => {
      console.error('게시물 조회 오류:', err);
      res.status(500).json({ error: '게시물 조회 중 오류 발생' });
    });
};

// 게시물 수정
exports.updatePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { title, content } = req.body;

  const sql = 'SELECT userId FROM posts WHERE id = ?';
  db.query(sql, [postId], (err, results) => {
    if (err) return res.status(500).json({ error: '게시물 조회 중 오류가 발생했습니다.' });

    const postOwnerId = results[0].userId;
    if (postOwnerId !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: '게시물 수정 권한이 없습니다.' });
    }

    const updateSql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
    db.query(updateSql, [title, content, postId], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: '게시물 수정 중 오류가 발생했습니다.' });
      res.json({ message: '게시물이 수정되었습니다.' });
    });
  });
};

// 게시물 삭제
exports.deletePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const sql = 'SELECT userId FROM posts WHERE id = ?';
  db.query(sql, [postId], (err, results) => {
    if (err) {
      console.error('게시글 조회 중 오류:', err);
      return res.status(500).json({ error: '게시글 조회 중 오류가 발생했습니다.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    const postOwnerId = results[0].userId;

    if (postOwnerId === userId || req.user.isAdmin) {
      const deleteSql = 'DELETE FROM posts WHERE id = ?';
      db.query(deleteSql, [postId], (deleteErr) => {
        if (deleteErr) {
          console.error('게시글 삭제 중 오류:', deleteErr);
          return res.status(500).json({ error: '게시글 삭제 중 오류가 발생했습니다.' });
        }

        res.json({ message: '게시글이 성공적으로 삭제되었습니다.' });
      });
    } else {
      return res.status(403).json({ message: '게시글 삭제 권한이 없습니다.' });
    }
  });
};

// 좋아요 추가/취소
exports.toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const liked = await Post.checkIfLiked(postId, userId);

    if (liked) {
      await Post.unlike(postId, userId);
      res.json({ message: '좋아요 취소 완료', action: 'unliked' });
    } else {
      await Post.like(postId, userId);
      res.json({ message: '좋아요 추가 완료', action: 'liked' });
    }
  } catch (error) {
    console.error('좋아요 처리 오류:', error);
    res.status(500).json({ error: '좋아요 처리 중 오류 발생' });
  }
};

// 내가 작성한 게시물 조회
exports.getMyPosts = (req, res) => {
  const userId = req.user.id;

  const sql = `
        SELECT posts.*,
               (SELECT COUNT(*) FROM post_likes WHERE post_likes.postId = posts.id) AS likeCount
        FROM posts
        WHERE posts.userId = ?
        ORDER BY posts.created_at DESC
    `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('게시물 조회 오류:', err);
      return res.status(500).json({ error: '게시물 조회 중 오류가 발생했습니다.' });
    }
    res.json(results);
  });
};

// 게시물 검색
exports.searchPosts = (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword || keyword.trim().length === 0) {
    return res.status(400).json({ error: '유효한 검색어를 입력해주세요.' });
  }

  const sql = `
        SELECT * FROM posts 
        WHERE title LIKE ? OR content LIKE ?
        ORDER BY created_at DESC
    `;
  const searchKeyword = `%${keyword}%`;

  db.query(sql, [searchKeyword, searchKeyword], (err, results) => {
    if (err) {
      console.error('게시물 검색 중 오류:', err);
      return res.status(500).json({ error: '게시물 검색 중 오류가 발생했습니다.' });
    }

    res.json(results);
  });
};
