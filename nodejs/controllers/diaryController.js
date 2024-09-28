const axios = require('axios');
const Diary = require('../models/diaryModel');
const Chatbot = require('../models/chatbotModel');
const db = require('../config/db');

exports.diaryController = async (req, res) => {
  try {
    const { userId, diaryText } = req.body;
    const currentDate = new Date().toISOString().split('T')[0]; // 오늘 날짜를 yyyy-mm-dd 형식으로 가져옴

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

      // 이미 오늘 작성된 일기가 있는지 확인
      const checkDiaryQuery = 'SELECT id FROM diaries WHERE userId = ? AND DATE(analyzed_at) = ?';
      db.query(checkDiaryQuery, [userId, currentDate], async (err, diaryResult) => {
        if (err) {
          console.error('일기 조회 오류:', err);
          return res.status(500).json({ success: false, message: '일기 조회 중 오류가 발생했습니다.' });
        }

        if (diaryResult.length > 0) {
          // 이미 오늘 작성된 일기가 있을 경우 -> 수정 모드로 전환
          const diaryId = diaryResult[0].id;

          // 일기 텍스트 및 감정 분석 결과 업데이트
          try {
            // Python 서버로 감정 분석 요청
            const pythonResponse = await axios.post('http://3.37.75.25:5001/predict', { diaryText });
            const analysisResult = pythonResponse.data;

            // 일기 및 감정 분석 결과 수정
            await Diary.updateDiary(diaryId, diaryText, userId);
            await Diary.updateEmotionResults(diaryId, analysisResult);

            // 챗봇 응답 갱신
            const chatbotResponse = await Chatbot.generateResponse(diaryText, analysisResult, communityNickname);
            await Chatbot.updateChatbotResponse(diaryId, chatbotResponse);

            res.json({
              success: true,
              message: '일기 및 감정 분석 결과가 수정되었습니다.',
              analysisResult,
              chatbotResponse
            });
          } catch (error) {
            console.error('일기 수정 중 오류:', error);
            res.status(500).json({ success: false, message: '일기 수정 중 오류가 발생했습니다.' });
          }
        } else {
          // 오늘 일기가 없을 경우 -> 새로운 일기 작성
          try {
            // Python 서버로 감정 분석 요청
            const pythonResponse = await axios.post('http://3.37.75.25:5001/predict', { diaryText });
            const analysisResult = pythonResponse.data;

            // 감정 결과가 있을 때만 할당
            const { 슬픔 = 0, 불안 = 0, 분노 = 0, 행복 = 0, 당황 = 0 } = analysisResult;

            // 일기 및 분석 결과 저장 (한글 감정 그대로 저장)
            const diaryId = await Diary.saveDiary(userId, communityNickname, diaryText, 슬픔, 불안, 분노, 행복, 당황);

            // 챗봇 응답 생성
            const chatbotResponse = await Chatbot.generateResponse(diaryText, analysisResult, communityNickname);
            await Chatbot.saveChatbotResponse(diaryId, userId, communityNickname, chatbotResponse);

            res.json({
              success: true,
              analysisResult: { 슬픔, 불안, 분노, 행복, 당황 },
              nickname: communityNickname,
              chatbotResponse, // 챗봇 응답도 같이 반환
              message: '일기 작성 및 감정 분석 결과가 저장되었습니다.',
            });
          } catch (error) {
            console.error('일기 작성 중 오류:', error);
            res.status(500).json({ success: false, message: '일기 작성 중 오류가 발생했습니다.' });
          }
        }
      });
    });
  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류',
    });
  }
};


// 특정 날짜의 일기 목록 조회
exports.getDiaryByDate = async (req, res) => {
  const { userId } = req.params;
  const { date } = req.query;  // yyyy-mm-dd 형식의 날짜를 query로 받아옴

  try {
    const diaries = await Diary.getDiaryByDate(userId, date);

    if (diaries.length === 0) {
      return res.status(404).json({ success: false, message: '해당 날짜에 작성된 일기가 없습니다.' });
    }

    res.json({
      success: true,
      diaries: diaries
    });
  } catch (error) {
    console.error('일기 조회 중 오류:', error);
    res.status(500).json({ success: false, message: '일기 조회 중 오류가 발생했습니다.' });
  }
};

// 전체 일기 목록 조회
exports.getAllDiaries = async (req, res) => {
  try {
    const userId = req.user.id;
    const diaries = await Diary.getAllDiaries(userId);

    res.json({ success: true, diaries });
  } catch (error) {
    console.error('전체 일기 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '전체 일기 목록 조회 중 오류 발생' });
  }
};

// 일기 수정 및 감정 분석/챗봇 응답 갱신
exports.updateDiary = (req, res) => {
  const { diaryId, diaryText } = req.body;
  const userId = req.user.id;

  // 일기 텍스트 수정
  Diary.updateDiary(diaryId, diaryText, userId)
    .then(() => {
      // 감정 분석 요청
      return axios.post('http://3.37.75.25:5001/predict', { diaryText });
    })
    .then(pythonResponse => {
      const analysisResult = pythonResponse.data;
      // const { 슬픔 = 0, 불안 = 0, 분노 = 0, 행복 = 0, 당황 = 0 } = analysisResult;

      // 감정 분석 결과 저장
      return Diary.updateEmotionResults(diaryId, analysisResult);
    })
    .then(() => {
      // 챗봇 응답 생성
      return Chatbot.generateResponse(diaryText, analysisResult, communityNickname);
    })
    .then(chatbotResponse => {
      // 챗봇 응답 저장
      return Chatbot.updateChatbotResponse(diaryId, chatbotResponse);
    })
    .then(() => {
      res.json({ message: '일기 및 감정 분석, 챗봇 응답 수정 성공' });
    })
    .catch(err => {
      console.error('일기 수정 중 오류:', err);
      res.status(500).json({ error: '일기 수정 중 오류가 발생했습니다.' });
    });
};

// 일기 삭제
exports.deleteDiary = (req, res) => {
  const { diaryId } = req.params;
  const userId = req.user.id;

  // 일기 삭제
  Diary.deleteDiary(diaryId, userId)
    .then(() => {
      // 감정 분석 결과 삭제
      return Diary.deleteEmotionResults(diaryId);
    })
    .then(() => {
      // 챗봇 응답 삭제
      return Chatbot.deleteChatbotResponse(diaryId);
    })
    .then(() => {
      res.json({ message: '일기 및 관련 데이터 삭제 성공' });
    })
    .catch(err => {
      console.error('일기 삭제 중 오류:', err);
      res.status(500).json({ error: '일기 삭제 중 오류가 발생했습니다.' });
    });
};
