const { OpenAI } = require('openai');
const db = require('../config/db');

// OpenAI API 키 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // 환경 변수에서 API 키를 불러옴
});

const Chatbot = {
  // GPT-4 API를 호출하여 상담 메시지 생성
  generateResponse: async (diaryText, emotions, communityNickname) => {
    try {
      // 분석결과 문자열로
      const emotionString = Object.entries(emotions)
        .map(([emotion, value]) => `${emotion}: ${value}%`)
        .join(', ');

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `너는 사용자의 (닉네임 ${communityNickname})의 일기를 읽고 조언을 해주는 상담사야. 
            일기를 토대로 분석된 감정 수치를 적절하게 잘 사용하여 사용자에게 조언이나 코멘트를 남겨줘. 
            분석된 감정이 적절하지 않다는 말은 하지 말고 분석된 감정을 절대적으로 사용해.
            분석된 감정에서 부정적 감정이 높다면 적절한 컨텐츠를 추천해줘도 좋아.
            응답할 때는 ${communityNickname}님이라고 호칭해.
            너무 길지 않게 작성해줘.`,
          },
          {
            role: 'user',
            content: `일기: ${diaryText}, \n감정 분석 결과:  ${emotionString}`,
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
