const axios = require('axios');

exports.analyzeDiary = async (req, res, next) => {
  try {
    const data = req.body; // 클라이언트가 보낸 일기데이터를 받아옴

    // Python 서버로 POST 요청 보내기
    const response = await axios.post('http://127.0.0.1:5001/predict', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Python 서버의 응답 데이터를 클라이언트로 전달
    res.json({
      success: true,
      prediction: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '파이썬 서버로부터 응답이 없습니다.',
    });
  }
};
