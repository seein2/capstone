const axios = require('axios');
const Diary = require('../models/diary');
const Chatbot = require('../models/chatbot');
const db = require('../config/db');

const diaryController = async (req, res) => {
  try {
    const { userId, diaryText } = req.body;

    // 커뮤니티 닉네임 가져오기
    const getNicknameQuery = 'SELECT community_nickname FROM users WHERE id = ?';
    db.query(getNicknameQuery, [userId], async (err, result) => {
      if (err) {
        console.error('커뮤니티 닉네임 조회 오류:', err);
        return res.status(500).json({ success: false, message: '커뮤니티 닉네임 조회 오류' });
      }

      const communityNickname = result[0]?.community_nickname;
      if (!communityNickname) {
        return res.status(404).json({ success: false, message: '커뮤니티 닉네임을 찾을 수 없습니다.' });
      }

      try {
        // Python 서버로 감정 분석 요청
        const pythonResponse = await axios.post('http://10.100.1.70:5001/predict', { diaryText });
        const analysisResult = pythonResponse.data;

        // 감정 결과가 없을 때 기본값 할당
        const { 불안 = 0, 당황 = 0, 분노 = 0, 슬픔 = 0, 행복 = 0 } = analysisResult;

        // 일기 및 분석 결과 저장 (한글 감정 그대로 저장)
        const diaryId = await Diary.saveDiary(userId, communityNickname, diaryText, 슬픔, 불안, 분노, 행복, 당황);

        // 감정 분석 결과를 클라이언트에 즉시 응답
        res.json({
          success: true,
          analysisResult: { 슬픔, 불안, 분노, 행복, 당황 },
          message: '감정 분석 결과를 반환했습니다.',
        });

        // 이후 비동기로 챗봇 응답 처리
        try {
          const chatbotResponse = await Chatbot.generateResponse(diaryText, { 슬픔, 불안, 분노, 행복, 당황 });
          await Chatbot.saveChatbotResponse(diaryId, userId, communityNickname, chatbotResponse);
          console.log('챗봇 응답이 성공적으로 저장되었습니다.');
        } catch (chatbotError) {
          console.error('챗봇 응답 처리 중 오류:', chatbotError);
        }

      } catch (error) {
        console.error('감정 분석 처리 중 오류:', error);
        res.status(500).json({ success: false, message: '감정 분석 처리 중 오류' });
      }
    });
  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류',
    });
  }
};

module.exports = { diaryController };
