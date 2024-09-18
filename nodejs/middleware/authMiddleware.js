const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// 사용자가 로그인이 안 돼 있을시 연결을 위한 미들웨어
// 근데 '/kakao_login.html'로 리다이렉트는 안 됨. ㅋㅋ
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/kakao_login.html');
            res.status(401).json({ error: '로그인이 필요합니다.' });
        }
    }
};

// JWT 검증 미들웨어
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ error: 'Access Token이 없습니다.' });
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Access Token이 유효하지 않습니다.' });
      req.user = user;
      next();
    });
  };