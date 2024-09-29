const Diary = require('../models/diaryModel');
const Chatbot = require('../models/chatbotModel');

exports.diaryController = async (req, res) => {
  try {
    const { userId, diaryText } = req.body;
    const result = await Diary.processAndSaveDiary(userId, diaryText);
    res.json(result);
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
  try {
    const {userId} = req.params;
    const { date } = req.query;  // yyyy-mm-dd 형식의 날짜를 query로 받아옴
    const result = await Diary.getDiaryByDate(userId, date);
    if (diaries.length === 0) {
      return res.status(404).json({ success: false, message: '해당 날짜에 작성된 일기가 없습니다.' });
    }
    res.json(result);
  } catch (error) {
    console.error('일기 조회 중 오류:', error);
    res.status(500).json({ success: false, message: '일기 조회 중 오류가 발생했습니다.' });
  }
};

// 전체 일기 목록 조회
exports.getAllDiaries = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Diary.getAllDiaries(userId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('전체 일기 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '전체 일기 목록 조회 중 오류 발생' });
  }
};

// 일기 수정 및 감정 분석/챗봇 응답 갱신
exports.updateDiary = async (req, res) => {
  try {
    const { diaryId, diaryText } = req.body;
    const userId = req.user.id;
    const result = await Diary.updateDiaryAndAnalyze(diaryId, diaryText, userId);
    res.json(result);
  } catch (err) {
    console.error('일기 수정 중 오류:', error);
    res.status(500).json({ error: '일기 수정 중 오류가 발생했습니다.' });
  }
};

// 일기 삭제
exports.deleteDiary = async (req, res) => {
  try {
    const { diaryId } = req.params;
    const userId = req.user.id;
    await Diary.deleteDiary(diaryId, userId);
    res.json({ message: '일기 삭제 성공' });
  } catch (error) {
    console.error('일기 삭제 중 오류:', error);
    res.status(500).json({ error: '일기 삭제 중 오류가 발생했습니다.' });
  }
};
