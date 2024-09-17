// controllers/predictController.js
const axios = require('axios');

const diaryController = async (req, res) => {
  try {
    const data = req.body; // 클라이언트가 보낸 데이터를 받아옴

    // Python 서버로 POST 요청 보내기
    const response = await axios.post('http://192.168.0.10:5001/predict', data)
    .then(response => {
      console.log('Response from Flask:', response.data);
    })
    .catch(error => {
      console.error('Error sending data to Flask:', error);
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
      message: 'Error while communicating with the Python server',
    });
  }
};

module.exports = { diaryController };