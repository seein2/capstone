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
    // 서버가 시작될 때 테이블 생성 확인 및 생성
    ensureTablesExist();
  }
});

// 테이블이 없을 경우 테이블 생성하는 함수
function ensureTablesExist() {
  const userTableSql = `
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT NOT NULL PRIMARY KEY,
      nickname VARCHAR(100),
      profile_image VARCHAR(255),
      community_nickname VARCHAR(100) UNIQUE,
      community_icon VARCHAR(255),
      is_profile_complete TINYINT(1) DEFAULT 0,
      isAdmin TINYINT(1) DEFAULT 0,
      fcmToken VARCHAR(255),
      email VARCHAR(255),
      refreshToken VARCHAR(255)
    );
  `;

  const postTableSql = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      userId BIGINT NOT NULL,
      likes INT DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const postLikeTableSql = `
    CREATE TABLE IF NOT EXISTS post_likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      postId INT NOT NULL,
      userId BIGINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const commentTableSql = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content TEXT NOT NULL,
      postId INT NOT NULL,
      userId BIGINT NOT NULL,
      likes INT DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const commentLikeTableSql = `
    CREATE TABLE IF NOT EXISTS comment_likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      commentId INT NOT NULL,
      userId BIGINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const diaryTableSql = `
    CREATE TABLE IF NOT EXISTS diaries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId BIGINT NOT NULL,
      community_nickname VARCHAR(100),
      diary_text TEXT NOT NULL,
      analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sadness DECIMAL(5,2),
      anxiety DECIMAL(5,2),
      anger DECIMAL(5,2),
      happiness DECIMAL(5,2),
      confusion DECIMAL(5,2)
    );
  `;

  const chatbotResponseTableSql = `
    CREATE TABLE IF NOT EXISTS chatbot_responses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      diary_id INT,
      userId BIGINT NOT NULL,
      community_nickname VARCHAR(100),
      response_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const queries = [
    userTableSql,
    postTableSql,
    postLikeTableSql,
    commentTableSql,
    commentLikeTableSql,
    diaryTableSql,
    chatbotResponseTableSql
  ];

  // 각 쿼리를 순차적으로 실행
  queries.forEach((sql, index) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.error(`테이블 생성 중 오류 발생 (Query ${index + 1}):`, err);
      } else {
        console.log(`테이블이 확인되었습니다 (Query ${index + 1}).`);
      }
    });
  });
}

module.exports = db;
