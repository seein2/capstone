// 푸시 알림 전송 함수
const sendPushNotification = (fcmToken, title, body) => {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: fcmToken, // 사용자 FCM 토큰
    };
  
    // 푸시 알림 전송
    admin.messaging().send(message)
      .then(response => {
        console.log('푸시 알림 전송 성공:', response);
      })
      .catch(error => {
        console.error('푸시 알림 전송 오류:', error);
      });
  };
  
  const axios = require('axios');

/* 토큰 만료 시 다시 firebase에 부탁해 만료된 토큰 처리하고 받는 함수
// FCM 푸시 알림 보내기
async function sendPushNotification(fcmToken, title, message) {
    const payload = {
        notification: {
            title: title,
            body: message,
        },
        to: fcmToken,
    };

    try {
        const response = await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
            headers: {
                'Authorization': 'key=YOUR_SERVER_KEY',
                'Content-Type': 'application/json',
            },
        });

        // FCM 응답 처리
        if (response.data.failure > 0) {
            console.error('FCM 알림 전송 실패:', response.data.results);

            // 만료된 토큰 처리
            const error = response.data.results[0].error;
            if (error === 'NotRegistered' || error === 'InvalidRegistration') {
                // DB에서 만료된 토큰 삭제
                const sql = 'UPDATE users SET fcmToken = NULL WHERE fcmToken = ?';
                db.query(sql, [fcmToken], (err) => {
                    if (err) {
                        console.error('FCM 토큰 삭제 중 오류:', err);
                    }
                });
            }
        }
    } catch (error) {
        console.error('FCM 요청 중 오류:', error);
    }
}
*/
module.exports = { sendPushNotification };