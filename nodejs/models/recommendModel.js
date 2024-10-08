const db = require('../config/db');

class Recommend {
    // 특정 기간동안의 감정 (gpt한테 보내면 알아서 추이를 파악하는 느낌)
    static async getEmotionTrends(userId, startDate, endDate) {
        const sql = `
            SELECT analyzed_at, sadness, anxiety, anger, happiness, confusion
            FROM diaries
            WHERE userId = ? AND analyzed_at BETWEEN ? AND ?
            ORDER BY analyzed_at
            `;
        return new Promise((resolve, reject) => {
            db.query(sql, [userId, startDate, endDate], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    // 부정적 감정의 평균?
    static negativeEmotions(emotionData) {
        const negativeEmotions = ['sadness', 'anxiety', 'anger'];
        const sum = emotionData.reduce((acc, data) => {
            return acc + negativeEmotions.reduce((sum, emotion) => sum + data[emotion], 0);
        }, 0);
        return sum / (emotionData.length * negativeEmotions.length);
    }
}

module.exports = Recommend;