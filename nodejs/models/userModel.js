const db = require('../config/db');

const User = {
    createOrUpdate: (user) => {
        return new Promise((resolve, reject) => {
            // 먼저 사용자 정보가 있는지 확인
            const checkSql = 'SELECT * FROM users WHERE id = ?';
            db.query(checkSql, [user.id], (err, results) => {
                if (err) return reject(err);

                // 기존 사용자 정보가 있으면 기존의 community_nickname과 community_icon을 유지
                let community_nickname = user.community_nickname;
                let community_icon = user.community_icon;
                let isProfileComplete = user.is_profile_complete;
                let email = user.email;  // 이메일 추가

                if (results.length > 0) {
                    const existingUser = results[0];

                    // 기존 데이터 유지
                    community_nickname = existingUser.community_nickname || community_nickname;
                    community_icon = existingUser.community_icon || community_icon;
                    isProfileComplete = existingUser.is_profile_complete;
                    email = existingUser.email || email;  // 이메일이 없는 경우 기존 이메일 유지
                }

                // 사용자 정보 업데이트 또는 삽입
                const sql = `
                    INSERT INTO users (id, nickname, profile_image, email, community_nickname, community_icon, is_profile_complete)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    nickname = VALUES(nickname),
                    profile_image = VALUES(profile_image),
                    email = IF(VALUES(email) IS NOT NULL, VALUES(email), email),
                    community_nickname = VALUES(community_nickname),
                    community_icon = VALUES(community_icon),
                    is_profile_complete = VALUES(is_profile_complete);
                    `;
                db.query(sql, [user.id, user.nickname, user.profile_image, user.email, community_nickname, community_icon, isProfileComplete], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            db.query(sql, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    },
};

// FCM 토큰 업데이트 함수
User.updateFcmToken = (userId, fcmToken) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET fcmToken = ? WHERE id = ?';
        db.query(sql, [fcmToken, userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = User;
