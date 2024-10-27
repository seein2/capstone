const db = require('../config/db');

class Recommend {
    // 특정 기간동안의 감정
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

    // 부정적 감정의 평균
    // static negativeEmotions(emotionData) {
    //     const negativeEmotions = ['sadness', 'anxiety', 'anger'];
    //     const sum = emotionData.reduce((acc, data) => {
    //         return acc + negativeEmotions.reduce((sum, emotion) => sum + data[emotion], 0);
    //     }, 0);
    //     return sum / (emotionData.length * negativeEmotions.length);
    // }

    // 주요 감정 파악
    static getMainEmotion(emotionData) {
        const latestEmotion = emotionData[emotionData.length - 1];
        const emotions = {
            sadness: latestEmotion.sadness,
            anxiety: latestEmotion.anxiety,
            anger: latestEmotion.anger,
            happiness: latestEmotion.happiness,
            confusion: latestEmotion.confusion
        };

        // 가장 높은 수치의 감정 반환
        return Object.entries(emotions) // 객체를 배열로 변환하고
            .reduce((max, [emotion, value]) => // 배열 구조분해
                value > max.value ? { emotion, value } : max, // 현재값이 지금 값보다 크면 새로운 값으로 업데이트
                { emotion: '', value: -1 }
            ).emotion; // 감정 이름만 반환 (값 빼고)
    }

    // 추천 콘텐츠 조회
    static async getContent(emotion) {

        // 특정 감정 랜덤으로 9개 추출
        const sql = `
        SELECT content_type, title, creator, link
        FROM contents
        WHERE emotion_type = ?
        ORDER BY RAND()
        LIMIT 9
        `;

        return new Promise((resolve, reject) => {
            db.query(sql, [emotion], (err, results) => {
                if (err) reject(err);
                else {
                    // 콘텐츠 타입별로 그룹화
                    const recommendations = {
                        // 각각 필터링해서 최대 3개 선택.
                        music: results.filter(r => r.content_type === 'MUSIC').slice(0, 3),
                        books: results.filter(r => r.content_type === 'BOOK').slice(0, 3),
                        videos: results.filter(r => r.content_type === 'VIDEO').slice(0, 3)
                    };
                    resolve(recommendations);
                }
            });
        });
    }


    // 가장 최근 추천 내용
    static async getLatestRecommendations(userId) {
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
                    resolve(results);
                }
            });
        });
    }

    static async saveRecommendations(userId, recommendations) {
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
}

module.exports = Recommend;