const db = require('../config/db');
const Chatbot = require('./chatbotModel');

class Diary {
  static async processAndSaveDiary(userId, diaryText) {
    console.log(`일기 처리 시작 - 사용자 ID: ${userId}`);
    try {
      const communityNickname = await this.getCommunityNickname(userId);
      console.log(`커뮤니티 닉네임 조회 완료: ${communityNickname}`);

      if (!communityNickname) {
        throw new Error('커뮤니티 닉네임을 찾을 수 없습니다.');
      }

      const emotions = await this.analyzeEmotions(diaryText);
      console.log('감정 분석 완료:', emotions);

      const diaryId = await this.saveDiary(userId, communityNickname, diaryText, emotions.슬픔, emotions.불안, emotions.분노, emotions.행복, emotions.당황);
      console.log(`일기 저장 완료 - 일기 ID: ${diaryId}`);

      const chatbotResponse = await Chatbot.generateResponse(diaryText, emotions, communityNickname);
      console.log('챗봇 응답 생성 완료');

      await Chatbot.saveChatbotResponse(diaryId, userId, communityNickname, chatbotResponse);
      console.log('챗봇 응답 저장 완료');

      return {
        success: true,
        diaryId,
        analysisResult: emotions,
        nickname: communityNickname,
        chatbotResponse,
        message: '감정 분석 결과와 챗봇 응답을 반환했습니다.',
      };
    } catch (error) {
      console.error('일기 처리 중 오류 발생:', error);

      if (error.message === '커뮤니티 닉네임을 찾을 수 없습니다.') {
        throw new Error('커뮤니티 닉네임을 찾을 수 없습니다.');
      }

      // 기타 에러는 일반적인 서버 에러로 처리
      throw new Error('일기 처리 중 오류가 발생했습니다.');
    }
  }

  static async getCommunityNickname(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT community_nickname FROM users WHERE id = ?';
      db.query(sql, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]?.community_nickname);
      });
    });
  }
  static async analyzeEmotions(diaryText) {
    try {
      const pythonResponse = await axios.post('http://3.37.75.25:5001/predict', { diaryText });
      const analysisResult = pythonResponse.data;
      return {
        슬픔: Math.round(analysisResult.슬픔 * 100) / 100 || 0,
        불안: Math.round(analysisResult.불안 * 100) / 100 || 0,
        분노: Math.round(analysisResult.분노 * 100) / 100 || 0,
        행복: Math.round(analysisResult.행복 * 100) / 100 || 0,
        당황: Math.round(analysisResult.당황 * 100) / 100 || 0
      };
    } catch (error) {
      console.err('감정 분석 중 오류:', error);
      throw new Error('감정 분석 중 오류');
    }
  }

  // 일기 데이터베이스에 저장
  static saveDiary(userId, communityNickname, diaryText, sadness, anxiety, anger, happiness, confusion) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO diaries (userId, community_nickname, diary_text, sadness, anxiety, anger, happiness, confusion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(sql, [userId, communityNickname, diaryText, sadness, anxiety, anger, happiness, confusion], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);  // 저장된 일기의 ID 반환
      });
    });
  }

  // 특정 날짜에 작성된 일기 목록 조회 메서드
  static getDiaryByDate(userId, selectedDate) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM diaries WHERE userId = ? AND DATE(analyzed_at) = ?';
      db.query(sql, [userId, selectedDate], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  // 사용자가 작성한 모든 일기 조회
  static getUserDiaries(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM diaries WHERE userId = ? ORDER BY analyzed_at DESC';
      db.query(sql, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }


  static async updateDiaryAndAnalyze(diaryId, diaryText, userId) {
    try {
      await this.updateDiary(diaryId, diaryText, userId);
      const emotions = await this.analyzeEmotions(diaryText);
      await this.updateEmotionResults(diaryId, emotions);
      const communityNickname = await this.getCommunityNickname(userId);
      const chatbotResponse = await Chatbot.generateResponse(diaryText, emotions, communityNickname);
      await Chatbot.saveChatbotResponse(diaryId, userId, communityNickname, chatbotResponse);
      return { message: '일기 및 감정 분석, 챗봇 응답 수정 성공' };
    } catch (error) {
      throw error;
    }
  }

  // 수정
  static updateDiary(diaryId, diaryText, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE diaries SET diary_text = ? WHERE id = ? AND userId = ?';
      db.query(sql, [diaryText, diaryId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
  // 감정 수정
  static updateEmotionResults(diaryId, emotions) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE diaries SET sadness = ?, anxiety = ?, anger = ?, happiness = ?, confusion = ? WHERE id = ?';
      db.query(sql, [emotions.슬픔, emotions.불안, emotions.분노, emotions.행복, emotions.당황, diaryId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // 일기 삭제 메서드
  static deleteDiary(diaryId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM diaries WHERE id = ? AND userId = ?';
      db.query(sql, [diaryId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}

module.exports = Diary;
