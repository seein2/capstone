const { OpenAI } = require('openai');
const db = require('../config/db');

// OpenAI API 키 설정
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // 환경 변수에서 API 키를 불러옴
  });

const Chatbot = {
  // GPT-4 API를 호출하여 상담 메시지 생성
  generateResponse: async (diaryText, analysisResult) => {
    const { sadness, anxiety, anger, happiness, confusion } = analysisResult;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '너는 감정일기와 감정 분석 결과를 읽고 이에 대해 사용자에게 조언을 제공하는 AI야.',
          },
          {
            role: 'user',
            content: `일기: ${diaryText}, 감정 분석 결과: 슬픔: ${sadness}%, 불안: ${anxiety}%, 분노: ${anger}%, 행복: ${happiness}%, 당황: ${confusion}%`,
          },
        ],
      });

      return response.choices[0].message.content;  // 챗봇의 응답 내용 반환
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // 챗봇 응답을 데이터베이스에 저장
  saveChatbotResponse: (diaryId, userId, communityNickname, responseText) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO chatbot_responses (diary_id, userId, community_nickname, response_text) 
        VALUES (?, ?, ?, ?)
      `;
      db.query(sql, [diaryId, userId, communityNickname, responseText], (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
};

module.exports = Chatbot;
