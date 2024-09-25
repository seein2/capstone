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

  // 특정 날짜에 작성된 일기 목록 조회 메서드
  getDiaryByDate: (userId, selectedDate) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM diaries WHERE userId = ? AND DATE(analyzed_at) = ?';
      db.query(sql, [userId, selectedDate], (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
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
  },

  // 일기 수정 메서드
  updateDiary: (diaryId, diaryText, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE diaries SET diary_text = ? WHERE id = ? AND userId = ?';
      db.query(sql, [diaryText, diaryId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // 일기 삭제 메서드
  deleteDiary: (diaryId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM diaries WHERE id = ? AND userId = ?';
      db.query(sql, [diaryId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
};

module.exports = Diary;
