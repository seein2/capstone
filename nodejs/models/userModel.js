const db = require('../config/db');

class User {
    static createOrUpdate(user) {
        return new Promise((resolve, reject) => {
            const checkSql = 'SELECT * FROM users WHERE id = ?';
            db.query(checkSql, [user.id], (err, results) => {
                if (err) return reject(err);

                let community_nickname = user.community_nickname;
                let community_icon = user.community_icon;
                let isProfileComplete = user.is_profile_complete;
                let email = user.email;

                if (results.length > 0) {
                    const existingUser = results[0];
                    community_nickname = existingUser.community_nickname || community_nickname;
                    community_icon = existingUser.community_icon || community_icon;
                    isProfileComplete = existingUser.is_profile_complete;
                    email = existingUser.email || email;
                }

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
                db.query(sql, [user.id, user.nickname, user.profile_image, email, community_nickname, community_icon, isProfileComplete], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            db.query(sql, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static updateFcmToken(userId, fcmToken) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET fcmToken = ? WHERE id = ?';
            db.query(sql, [fcmToken, userId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = User;