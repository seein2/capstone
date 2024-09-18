const db = require('../config/db');

// 프로필 정보 가져오기
exports.getProfile = (req, res) => {
    const userId = req.user.id;

    const sql = 'SELECT community_nickname, community_icon FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('프로필 정보를 가져오는 중 오류:', err);
            return res.status(500).json({ error: '프로필 정보를 가져오는 중 오류가 발생했습니다.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        res.json(results[0]);
    });
};

// 프로필 설정 페이지 렌더링 및 API 처리
exports.getProfileSetup = (req, res) => {
    if (!req.isAuthenticated()) {
        // 클라이언트가 AJAX 또는 앱 요청인 경우 JSON으로 처리
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(401).json({ error: '로그인이 필요합니다.' });
        } else {
            return res.redirect('/kakao_login.html'); // 웹 브라우저인 경우 리디렉트
        }
    }

    // 앱 요청인 경우 JSON 응답
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ message: '프로필 설정이 필요합니다.' });
    }

    // 웹 브라우저인 경우 HTML 파일 응답
    res.sendFile(path.join(__dirname, '..', 'public', 'profile_setup.html'));
};

// 프로필 설정 처리
exports.setupProfile = (req, res) => {
    const { nickname, icon } = req.body;
    const userId = req.user.id;

    const sql = 'UPDATE users SET community_nickname = ?, community_icon = ?, is_profile_complete = true WHERE id = ?';
    db.query(sql, [nickname, icon, userId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: '이미 사용 중인 커뮤니티 닉네임입니다.' });
            }
            console.error('프로필 설정 중 오류:', err);
            return res.status(500).json({ error: '프로필 설정 중 오류가 발생했습니다.' });
        }

        res.json({ success: true });
    });
};

// 프로필 수정 처리
exports.editProfile = (req, res) => {
    const { nickname, icon } = req.body;
    const userId = req.user.id;

    if (!nickname) {
        return res.status(400).json({ error: '닉네임은 필수 입력 항목입니다.' });
    }

    const sql = 'UPDATE users SET community_nickname = ?, community_icon = ? WHERE id = ?';
    db.query(sql, [nickname, icon, userId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: '이미 사용 중인 커뮤니티 닉네임입니다.' });
            }
            console.error('프로필 업데이트 중 오류:', err);
            return res.status(500).json({ error: '프로필 업데이트 중 오류가 발생했습니다.' });
        }

        res.json({ success: true });
    });
};

// 사용자 정보 가져오기 (로그인된 사용자의 ID 및 권한)
exports.getUserInfo = (req, res) => {
    if (req.user) {
        res.json({
            userId: req.user.id,
            isAdmin: req.user.isAdmin || false,  // 관리자인지 여부
        });
    } else {
        res.status(401).json({ error: '로그인이 필요합니다.' });
    }
};