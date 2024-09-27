const { OpenAI } = require('openai');
const db = require('../config/db');

// OpenAI API 키 설정
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // 환경 변수에서 API 키를 불러옴
  });

const Chatbot = {
  // GPT-4 API를 호출하여 상담 메시지 생성
  generateResponse: async (diaryText, analysisResult, communityNickname) => {
    const { 슬픔, 불안, 분노, 행복, 당황 } = analysisResult;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `당신은 ${communityNickname}님의 일기를 읽고 조언을 해주는 상담사입니다. 일기를 토대로 분석된 감정 수치를 적절하게 잘 사용하여 ${communityNickname}님에게 조언이나 코멘트를 남겨주세요. 분석된 감정이 정확하지 않을 수 있지만 그대로 인용해서 시스템의 퀄리티를 높여주세요. 응답할 때 ${communityNickname}님이라고 호칭해주세요.`,
          },
          {
            role: 'user',
            content: `일기: ${diaryText}, 감정 분석 결과: 슬픔: ${슬픔}%, 불안: ${불안}%, 분노: ${분노}%, 행복: ${행복}%, 당황: ${당황}%`,
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
