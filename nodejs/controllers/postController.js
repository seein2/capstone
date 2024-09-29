const Post = require('../models/postModel');

// 게시물 작성
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user ? req.user.id : null;
    if (!title || !content) {
      return res.status(400).json({ error: '제목과 내용을 입력해야 합니다.' });
    }
    // userId가 없는 경우 에러 처리
    if (!userId) {
      return res.status(400).json({ error: '로그인된 사용자만 게시물을 작성할 수 있습니다.' });
    }
    const result = await Post.create({ title, content, userId });
    res.json({ message: '게시물 작성 성공', postId: result.insertId });
  } catch (err) {
    console.error('게시물 작성 오류:', err);
    res.status(500).json({ error: '게시물 작성 중 오류 발생' });
  }
};

// 게시물 목록 조회 (페이징 적용)
exports.getAllPostsWithPaging = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await Post.getAllWithPaging(page, limit, userId);
    res.json(result);
  } catch (err) {
    console.error('게시물 조회 오류:', err);
    res.status(500).json({ error: '게시물 조회 중 오류 발생' });
  }
};

// 게시물 수정
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content } = req.body;
    const result = await Post.update(postId, userId, title, content, req.user.isAdmin);
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    res.status(500).json({ error: '게시물 수정중 오류 발생!' });
  }
};

// 게시물 삭제
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const result = await Post.delete(postId, userId, req.user.isAdmin);
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error('게시글 삭제 오류: ', err);
    res.status(500).json({ eeror: '게시글 삭제중 오류' });
  }
};

// 좋아요 추가/취소
exports.toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const result = await Post.toggleLike(postId, userId);
    res.json(result);
  } catch (error) {
    console.error('좋아요 처리 오류:', error);
    res.status(500).json({ error: '좋아요 처리 중 오류 발생' });
  }
};

// 내가 작성한 게시물 조회
exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Post.getMyPosts(userId);
    res.json(result);
  } catch (err) {
    console.error('게시물 조회 오류: ', err)
    res.status(500).json({ error: '게시물 조회 중 오류 발생' })
  }
};

// 게시물 검색
exports.searchPosts = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ error: '유효한 검색어를 입력해주세요.' });
    }
    const result = await Post.search(keyword);
    res.json(result);
  } catch (err) {
    console.error('게시물 검색 오류: ', err);
    res.status(500).json({ error: '게시물 검색 중 오류 발생' });
  }
};
