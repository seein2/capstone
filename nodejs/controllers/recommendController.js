const Recommend = require('../models/recommendModel');
const Chatbot = require('../models/chatbotModel');

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.body;

        // 특정 기간동안의 감정 추이
        const emotionTrends = await Recommend.getEmotionTrends(userId, startDate, endDate);
        if (!emotionTrends || emotionTrends.length === 0) {
            console.log('No emotion data found');
            return res.status(404).json({
                success: false,
                message: '해당 기간의 감정 데이터가 없습니다.'
            });
        }
        // 구한 감정을 사용하여 부정감정의 평균을 구함
        // const negativeEmotions = Recommend.negativeEmotions(emotionTrends);

        // 주요 감정 파악
        const mainEmotion = Recommend.getMainEmotion(emotionTrends)
        
        // 감정 추이와 부정 감정을 챗봇에게 전달하여 추천을 받음
        // const recommendations = await Chatbot.generateRecommendations(userId, emotionTrends, negativeEmotions);

        // 추천 조회
        const contents = await Recommend.getContent(mainEmotion)

        await Recommend.saveRecommendations(userId, contents);

        res.json({ success: true, contents, mainEmotion });
    } catch (error) {
        console.error('추천 생성 중 오류:', error);
        res.status(500).json({ success: false, message: '추천 생성 중 오류가 발생했습니다.' });
    }
};

exports.getLatestRecommendations = async (req, res) => {
    try {
        const userId = req.user?.id;
        const result = await Recommend.getLatestRecommendations(userId);

        if (!result || result.length === 0) {
            console.log('Empty result received');
            return res.status(204).json({ success: true, message: '추천 결과가 없습니다.' });
        }
        return res.json({ success: true, result });
    } catch (error) {
        return res.status(500).json({ success: false, message: '추천 내용을 불러오는 중 오류 발생' });
    }
};