const Recommend = require('../models/recommendModel');
const Chatbot = require('../models/chatbotModel');

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const emotionTrends = await Recommend.getEmotionTrends(userId, startDate, endDate);
        const averageNegativeEmotions = Recommend.negativeEmotions(emotionTrends);

        const recommendations = await Chatbot.generateRecommendations(userId, emotionTrends, averageNegativeEmotions);
        await Chatbot.saveRecommendations(userId, recommendations);

        res.json({ success: true, recommendations });
    } catch (error) {
        console.error('추천 생성 중 오류:', error);
        res.status(500).json({ success: false, message: '추천 생성 중 오류가 발생했습니다.' });
    }
};