// MySQL을 기반으로 하여 데이터베이스 연결 설정

const mysql = require('mysql2');
require('dotenv').config();  // 환경 변수 불러오기

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

// 데이터베이스 연결
db.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err);
  } else {
    console.log('데이터베이스에 성공적으로 연결되었습니다.');
  }
});

module.exports = db;  // 연결된 db 객체를 모듈로 내보내기

