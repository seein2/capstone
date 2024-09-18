// controllers/diaryController.js
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
        const pythonResponse = await axios.post('http://192.168.35.33:5001/predict', { diaryText });
        const { sadness, anxiety, anger, happiness, confusion } = pythonResponse.data;

        // 일기 및 분석 결과 저장
        const diaryId = await Diary.saveDiary(userId, communityNickname, diaryText, sadness, anxiety, anger, happiness, confusion);

        // 챗봇 응답 생성 및 저장
        const chatbotResponse = await Chatbot.generateResponse(diaryText, { sadness, anxiety, anger, happiness, confusion });
        await Chatbot.saveChatbotResponse(diaryId, userId, communityNickname, chatbotResponse);

        // 클라이언트로 응답 전송
        res.json({
          success: true,
          analysisResult: { sadness, anxiety, anger, happiness, confusion },
          chatbotResponse,
        });
      } catch (error) {
        console.error('감정 분석 또는 챗봇 응답 처리 중 오류:', error);
        res.status(500).json({ success: false, message: '감정 분석 또는 챗봇 응답 처리 중 오류' });
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
