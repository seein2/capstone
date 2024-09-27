const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const admin = require('firebase-admin');
require('dotenv').config();

const passport = require('./passport/passport');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const diaryRouter = require('./routes/diary');
const profileRoutes = require('./routes/profileRoutes');
const serviceAccount = require('./firebase-admin-key.json');

// 웹 관련 (세션임)
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({
    host: process.env.DATABASE_HOST,
    port: 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

// ------------------------------------------------------

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
// app.use(morgan('combined', {
//     skip: function (req, res) { return res.statusCode < 400 }
//     })); // 로그 표시 ( 400이상 상태코드만 표시)
app.use(morgan('combined'));

app.use(cors({
    origin: '*',  // 모든 출처에서의 요청 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // 허용할 메소드 지정
    credentials: true  // 자격 증명(쿠키, 인증 헤더 등)을 포함한 요청 허용
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Passport 설정
app.use(passport.initialize());
app.use(passport.session());

// Firebase Admin SDK 초기화
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// 세션 설정
app.use(session({
    secret: process.env.SECRET_KEY || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// 라우트 설정
app.use('/auth', authRoutes); // 인증 관련 라우트
app.use('/profile', profileRoutes); // 사용자 정보 관련 라우트
app.use('/community', postRoutes); // 게시물 관련 라우트
app.use('/community', commentRoutes); // 댓글 관련 라우트
app.use('/diary', diaryRouter); // 다이어리 관련 라우트

// 'settings' 경로에 대한 라우트
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});
// 홈 경로
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// 서버시작
app.listen(port, '0.0.0.0', () => {
    console.log(`서버가 http://0.0.0.0:${port} 에서 실행 중입니다.`);
});