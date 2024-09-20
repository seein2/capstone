const axios = require('axios');
const jwt = require('jsonwebtoken'); // JWT 토큰을 위한 라이브러리
const db = require('../config/db');
const User = require('../models/userModel');
const passport = require('../passport/passport');

// JWT 비밀키는 .env에 저장
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// JWT 토큰 생성 함수
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' }); // 24시간 유효
};

// 카카오 인증 후 사용자 정보를 저장하는 경로
exports.kakaoCallback = (req, res) => {
  const { accessToken } = req.body;
  
  if (!accessToken) {
    return res.status(400).json({ error: 'AccessToken이 없습니다.' });
  }

  axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
    .then(response => {
      const kakaoAccount = response.data.kakao_account;

      const user = {
        id: response.data.id,
        nickname: kakaoAccount.profile.nickname,
        profile_image: kakaoAccount.profile.profile_image_url,
        email: kakaoAccount.email,
        is_profile_complete: false
      };

      User.createOrUpdate(user)
        .then(() => {
          req.login(user, async (err) => {
            if (err) {
              return res.status(500).json({ error: '세션 저장 오류' });
            }

            const existingUser = await User.findById(user.id);
            const accessToken = generateAccessToken(existingUser);

            res.json({
              accessToken: accessToken,
              isProfileComplete: existingUser.is_profile_complete
            });
          });
        })
        .catch(err => res.status(500).json({ error: '사용자 저장 오류' }));
    })
    .catch(error => {
      console.error('카카오 사용자 정보 요청 오류:', error);
      res.status(500).json({ error: '카카오 사용자 정보 요청 오류' });
    });
};

// 로그아웃 처리
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed.' });
    }
    res.json({ message: '로그아웃 성공' });
  });
};

// 토큰 검증 엔드포인트
exports.verifyToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Token이 없습니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Access Token이 유효하지 않습니다.' });
    }

    // 토큰이 유효하면 사용자 정보를 반환
    res.json({ user });
  });
};

// 회원탈퇴 처리
exports.deleteAccount = (req, res) => {
  const userId = req.user.id;

  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('회원탈퇴 중 오류:', err);
      return res.status(500).json({ error: '회원탈퇴 중 오류가 발생했습니다.' });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    req.logout(function (err) {
      if (err) {
        console.error('로그아웃 중 오류:', err);
        return res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다.' });
      }

      res.json({ message: '회원탈퇴 및 세션 삭제가 완료되었습니다.' });
    });
  });
};