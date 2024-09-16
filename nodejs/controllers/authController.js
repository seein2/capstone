const axios = require('axios');
const jwt = require('jsonwebtoken'); // JWT 토큰을 위한 라이브러리
const db = require('../config/db');
const User = require('../models/userModel');
const passport = require('../passport/passport');

// JWT 비밀키는 .env에 저장
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

// JWT 토큰 생성 함수
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

// JWT 토큰을 갱신 해줄 리프레시 토큰 함수
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
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
            const refreshToken = generateRefreshToken(existingUser);

            // Refresh Token을 DB 또는 안전한 저장소에 저장
            User.saveRefreshToken(existingUser.id, refreshToken)
              .then(() => {
                res.json({
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                  redirecturl: existingUser.is_profile_complete ? '/community.html' : '/profile_setup.html'
                });
              })
              .catch(err => res.status(500).json({ error: '토큰 저장 오류' }));
          });
        })
        .catch(err => res.status(500).json({ error: '사용자 저장 오류' }));
    })
    .catch(error => {
      console.error('카카오 사용자 정보 요청 오류:', error);
      res.status(500).json({ error: '카카오 사용자 정보 요청 오류' });
    });
};

// Access Token 갱신을 위한 라우트
exports.refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh Token이 없습니다.' });

  // Refresh Token 검증
  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Refresh Token이 유효하지 않습니다.' });

    // 새로운 Access Token 발급
    const newAccessToken = generateAccessToken({ id: user.id, email: user.email });
    res.json({ accessToken: newAccessToken });
  });
};

// 로그아웃 처리 (리프레시 토큰도 삭제)
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed.' });
    }
    // Refresh Token 삭제 로직 추가
    User.deleteRefreshToken(req.user.id)
      .then(() => {
        const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${encodeURIComponent(process.env.KAKAO_LOGOUT_REDIRECT_URI)}`;
        res.redirect(kakaoLogoutUrl);
      })
      .catch(err => res.status(500).json({ message: 'Refresh Token 삭제 실패' }));
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

    // 세션 테이블에서 해당 사용자의 세션 삭제
    db.query('DELETE FROM sessions WHERE data LIKE ?', [`%"passport":{"user":${userId}}%`], (err) => {
      if (err) {
        console.error('세션 삭제 중 오류:', err);
        return res.status(500).json({ error: '세션 삭제 중 오류가 발생했습니다.' });
      }

      // 탈퇴가 완료되었을 경우 세션을 파기하고 로그아웃 처리
      req.logout(function (err) {
        if (err) {
          console.error('로그아웃 중 오류:', err);
          return res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다.' });
        }

        res.json({ message: '회원탈퇴 및 세션 삭제가 완료되었습니다.' });
      });
    });
  });
};