const { OpenAI } = require('openai');
const db = require('../config/db');

class Chatbot {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY // 환경 변수에서 API 키를 불러옴
    });
  }

  // 코멘트챗봇임
  async generateResponse(diaryText, emotions, communityNickname) {
    try {
      const emotionString = Object.entries(emotions)
        .map(([emotion, value]) => `${emotion}: ${value}%`)
        .join(', ');

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `너는 사용자의 (닉네임: ${communityNickname})의 일기를 읽고 조언을 해주는 상담사야. 
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

      return response.choices[0].message.content;
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async saveChatbotResponse(diaryId, userId, communityNickname, responseText) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO chatbot_responses (diary_id, userId, community_nickname, response_text) 
        VALUES (?, ?, ?, ?)
      `;
      db.query(sql, [diaryId, userId, communityNickname, responseText], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async updateChatbotResponse(diaryId) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE chatbot_responses SET response_text = ? WHERE diary_id = ?';
      db.query(sql, [diaryId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  // 여기까지 코멘트챗봇

  // 추천관련챗봇임
  async generateRecommendations(userId, emotionTrends, averageNegativeEmotions) {
    try {
      const emotionTrendsString = JSON.stringify(emotionTrends);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `너는 사용자의 감정 변화 추이를 분석하고 적절한 활동이나 콘텐츠를 추천하는 상담사야. 
            감정 변화의 폭이 크거나 부정적 감정이 높은 경우에 알맞게 추천해줘.`,
          },
          {
            role: 'user',
            content: `사용자의 감정 변화 추이: ${emotionTrendsString}
            평균 부정적 감정 수치: ${averageNegativeEmotions}
            
            이 데이터를 바탕으로 사용자에게 도움이 될 만한 3가지의 도서를 추천하고, 3가지의 유투브 링크를 걸어줘`,
          },
        ],
        max_tokens: 500,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('추천 생성 중 오류 발생:', error);
      throw error;
    }
  }

  async saveRecommendations(userId, recommendations) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO user_recommendations (userId, recommendations, created_at) 
        VALUES (?, ?, NOW())
      `;
      db.query(sql, [userId, JSON.stringify(recommendations)], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getLatestRecommendations(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT recommendations, created_at 
        FROM user_recommendations 
        WHERE userId = ? 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      db.query(sql, [userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0] ? JSON.parse(results[0].recommendations) : null);
        }
      });
    });
  }
}

module.exports = new Chatbot(); // 싱글톤 인스턴스