const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// 사용자가 로그인이 안 돼 있을 시 연결을 위한 미들웨어
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();  // 인증이 성공하면 다음 미들웨어로 진행
    } else {
      // 응답이 이미 전송되었는지 확인
      if (res.headersSent) {
        return;  // 이미 응답이 전송되었다면 함수를 중단
      }

      // 클라이언트가 AJAX 요청인지 확인
      if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }

      // 앱에서는 리디렉트가 아닌 JSON 응답만 처리하게 하기 위해 HTML 리디렉트를 제거
      return res.status(401).json({ error: '로그인이 필요합니다. (웹에서는 로그인 페이지로 리디렉트됨)' });
    }
  }
};

// JWT 검증 미들웨어
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Token이 없습니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Access Token이 유효하지 않습니다.' });
    }

    req.user = user;
    next();
  });
};

/*
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    // JWT 검증을 사용할 경우 세션 인증은 필요 없음
    const isAppRequest = req.headers['authorization']; // Authorization 헤더가 있는지 확인하여 앱 요청 구분

    if (isAppRequest) {
      // 세션 인증을 건너뛰고, 다음 미들웨어로 바로 진행 (JWT 검증을 할 것이므로)
      return next();
    }

    if (req.isAuthenticated()) {
      return next();  // 세션 기반 인증 (웹에서만 사용)
    } else {
      if (res.headersSent) {
        return;  // 이미 응답이 전송되었다면 함수를 중단
      }

      if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }

      return res.redirect('/kakao_login.html');  // 웹 브라우저에서 로그인 페이지로 리다이렉트
    }
  }
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Token이 없습니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT 검증 오류:", err);  // JWT 오류 로그 추가
      return res.status(403).json({ error: 'Access Token이 유효하지 않습니다.' });
    }

    req.user = user;
    next();
  });
};



앱에서 해줘야 할 일
1. 로그인 후 JWT 토큰 저장
로그인 성공 후 **JWT 토큰(accessToken)**을 받아서 앱의 로컬 스토리지 또는 SharedPreferences에 저장해야 합니다.
2. API 요청 시 JWT 토큰 전송
각 API 요청을 보낼 때, HTTP 요청 헤더에 Authorization 헤더를 추가해야 합니다.
헤더 값으로는 Bearer <JWT 토큰> 형식으로 전송해야 합니다

ApiService.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'https://1c4c-106-101-10-23.ngrok-free.app'; // 서버 URL 변경

  // JWT 토큰 저장
  static Future<void> saveTokens(String accessToken) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', accessToken); // Access Token 저장
  }

  // JWT 토큰 불러오기
  static Future<String?> getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('accessToken'); // 저장된 Access Token 반환
  }

  // 카카오 로그인
  static Future<void> kakaoLogin(String kakaoAccessToken, BuildContext context) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/kakao/callback'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'accessToken': kakaoAccessToken}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await saveTokens(data['accessToken']); // JWT Access Token 저장
    } else {
      throw Exception('Failed to login with Kakao');
    }
  }
}
// 커뮤니티에서 미들웨어 예시

// 게시물 목록을 가져오는 메서드
  static Future<List<dynamic>> getPosts(BuildContext context) async {
    final accessToken = await getAccessToken(); // 저장된 Access Token 가져오기

    if (accessToken == null) {
      throw Exception('Access Token이 없습니다.');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/community/posts'),
      headers: {
        'Authorization': 'Bearer $accessToken', // Authorization 헤더에 JWT 토큰 추가
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // 성공 시 게시물 데이터 반환
    } else if (response.statusCode == 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      throw Exception('권한이 없습니다.');
    } else {
      throw Exception('게시물 가져오기 실패');
    }
  }

*/