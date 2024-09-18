// models/diary.js
const db = require('../config/db');

const Diary = {
  // 일기 데이터베이스에 저장
  saveDiary: (userId, communityNickname, diaryText, sadness, anxiety, anger, happiness, confusion) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO diaries (userId, community_nickname, diary_text, sadness, anxiety, anger, happiness, confusion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(sql, [userId, communityNickname, diaryText, sadness, anxiety, anger, happiness, confusion], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.insertId);  // 저장된 일기의 ID 반환
      });
    });
  },

  // 사용자가 작성한 모든 일기 조회
  getUserDiaries: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM diaries WHERE userId = ? ORDER BY analyzed_at DESC';
      db.query(sql, [userId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }
};

module.exports = Diary;
