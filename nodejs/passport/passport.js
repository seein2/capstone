const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/userModel');  // 올바른 경로 확인 필요

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null));
});

passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: process.env.KAKAO_CALLBACK_URL || '/auth/kakao/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // 이메일 정보 가져오기 (이메일이 동의된 경우에만)
        const kakaoAccount = profile._json.kakao_account;
        const email = kakaoAccount.has_email ? kakaoAccount.email : null;

        const user = {
            id: profile.id,
            nickname: profile.displayName,
            email: email,  // 이메일 추가
            is_profile_complete: false  // 프로필 완성 여부 초기값
        };

        await User.createOrUpdate(user);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

module.exports = passport;
