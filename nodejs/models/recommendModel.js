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
        // 각 타입별로 따로 쿼리를 실행하여 확실히 각 타입의 컨텐츠를 가져옴
        const sql = `
            SELECT content_type, title, creator, link
            FROM content_master
            WHERE emotion_type = ? AND content_type = ?
            ORDER BY RAND()
            LIMIT ?
        `;

        try {
            const typeConfig = {
                'MUSIC': 3,
                'BOOK': 3,
                'VIDEO': 3
            };
            const recommendations = {
                music: [],
                books: [],
                videos: []
            };

            // 각 타입별로 병렬로 쿼리 실행
            const results = await Promise.allSettled(
                Object.entries(typeConfig).map(([type, limit]) =>
                    new Promise((resolve, reject) => {
                        db.query(sql, [emotion, type, limit], (err, results) => {
                            if (err) reject(err);
                            else resolve({ type, results });
                        });
                    })
                )
            );

            // 결과를 appropriate 키에 할당
            results.forEach(({ type, results }) => {
                switch (type) {
                    case 'MUSIC':
                        recommendations.music = results;
                        break;
                    case 'BOOK':
                        recommendations.books = results;
                        break;
                    case 'VIDEO':
                        recommendations.videos = results;
                        break;
                }
            });

            return recommendations;
        } catch (error) {
            console.error('Error getting content:', error);
            throw error;
        }
    }


    // 가장 최근 추천 내용
    static async getLatestRecommendations(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT recommendations, created_at 
                FROM user_recommendations 
                WHERE userId = ? 
                ORDER BY id DESC
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