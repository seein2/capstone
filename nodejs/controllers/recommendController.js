const Recommend = require('../models/recommendModel');
const Chatbot = require('../models/chatbotModel');

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.body;

        // 특정 기간동안의 감정 추이를 구하고
        const emotionTrends = await Recommend.getEmotionTrends(userId, startDate, endDate);
        // 구한 감정을 사용하여 부정감정의 평균을 구함
        const negativeEmotions = Recommend.negativeEmotions(emotionTrends);

        // 감정 추이와 부정 감정을 챗봇에게 전달하여 추천을 받음
        const recommendations = await Chatbot.generateRecommendations(userId, emotionTrends, negativeEmotions);
        await Chatbot.saveRecommendations(userId, recommendations);

        res.json({ success: true, recommendations });
    } catch (error) {
        console.error('추천 생성 중 오류:', error);
        res.status(500).json({ success: false, message: '추천 생성 중 오류가 발생했습니다.' });
    }
};