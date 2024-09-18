import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_calendar_app/models/profile.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_calendar_app/main.dart';
import 'package:flutter_calendar_app/ProfileSettingPage.dart';
import 'package:flutter_calendar_app/CommunityPage.dart';
import '../models/post.dart';
import '../models/user.dart';

class ApiService {
  static const String baseUrl = 'https://1c4c-106-101-10-23.ngrok-free.app';

  // JWT 토큰 저장
  static Future<void> saveTokens(String accessToken, String refreshToken) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', accessToken);
    await prefs.setString('refreshToken', refreshToken);
  }

  // JWT 토큰 불러오기
  static Future<String?> getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('accessToken');
  }

  // 리프레시 토큰 불러오기
  static Future<String?> getRefreshToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('refreshToken');
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
      await saveTokens(data['accessToken'], data['refreshToken']);
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => data['isProfileComplete'] ? CommunityPage() : ProfileSettingPage()),
      );
    } else {
      throw Exception('Failed to login with Kakao');
    }
  }

  // 토큰 갱신
  static Future<void> refreshToken(BuildContext context) async {
    final refreshToken = await getRefreshToken();
    if (refreshToken == null) throw Exception('No refresh token available');

    final response = await http.post(
      Uri.parse('$baseUrl/auth/token'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refreshToken': refreshToken}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await saveTokens(data['accessToken'], refreshToken);
    } else {
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (context) => MyApp()));
      throw Exception('Failed to refresh token');
    }
  }

  // 사용자 정보 가져오기
  static Future<UserInfo> getUserInfo(BuildContext context) async {
    final accessToken = await getAccessToken();
    if (accessToken == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.')),
      );
      throw Exception('로그인이 필요합니다.');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/profile/user-info'),
      headers: {
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return UserInfo.fromJson(data);
    } else {
      throw Exception('사용자 정보를 가져오는 데 실패했습니다. 에러 코드: ${response.statusCode}');
    }
  }

  // 프로필 설정 정보 가져오기
  static Future<ProfileInfo> getProfileSetup(BuildContext context) async {
    final accessToken = await getAccessToken();
    if (accessToken == null) {
      throw Exception('Access Token is not available.');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/profile/setup'),
      headers: {'Authorization': 'Bearer $accessToken'},
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load profile info. Status code: ${response.statusCode}');
    }
  }

// 프로필 정보 설정
  static Future<void> setupProfile(String nickname, String icon, BuildContext context) async {
    final accessToken = await getAccessToken();
    final response = await http.post(
      Uri.parse('$baseUrl/profile/setup'),
      headers: {
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'nickname': nickname,
        'icon': icon
      }),
    );

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('프로필 정보가 성공적으로 업데이트 되었습니다.'))
      );
    } else {
      throw Exception('프로필 정보를 업데이트하는 데 실패했습니다. 에러 코드: ${response.statusCode}');
    }
  }


  // 프로필 정보 가져오기
  static Future<ProfileInfo> getProfileInfo(BuildContext context) async {
    final accessToken = await getAccessToken();
    if (accessToken == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.')),
      );
      throw Exception('로그인이 필요합니다.');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/profile/profile'),
      headers: {
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return ProfileInfo.fromJson(data);
    } else {
      throw Exception('프로필 정보를 가져오는 데 실패했습니다. 에러 코드: ${response.statusCode}');
    }
  }

  // 게시물 가져오기
  static Future<List<Post>> getPosts(BuildContext context, {int page = 1, int pageSize = 10}) async {
    final accessToken = await getAccessToken();
    final response = await http.get(
      Uri.parse('$baseUrl/community/posts'),
      headers: {'Authorization': 'Bearer $accessToken'},
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> responseData = jsonDecode(response.body);
      final List<dynamic> postJsonList = responseData['posts'] as List;
      List<Post> posts = postJsonList.map((json) => Post.fromJson(json as Map<String, dynamic>)).toList();
      return posts;
    } else if (response.statusCode == 401) {
      await refreshToken(context);
      return getPosts(context);  // 토큰 갱신 후 다시 요청
    } else {
      throw Exception('Failed to load posts');
    }
  }

  // 게시물 생성
  static Future<void> createPost(String userId, String title, String content, BuildContext context) async {
    final accessToken = await getAccessToken();
    final response = await http.post(
      Uri.parse('$baseUrl/community/create'),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode({
        'userId': userId,
        'title': title,
        'content': content,
      }),
    );

    if (response.statusCode == 201) {
      // 성공적으로 게시물이 생성됨
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('게시물이 생성되었습니다.'))
      );
    } else {
      // 실패
      throw Exception('Failed to create post');
    }
  }

  // 게시물 수정
  static Future<void> updatePost(String postId, String title, String content, BuildContext context) async {
    final accessToken = await getAccessToken();
    final response = await http.put(
      Uri.parse('$baseUrl/community/posts/$postId'),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode({
        'title': title,
        'content': content,
      }),
    );

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('게시물이 수정되었습니다.'))
      );
    } else {
      throw Exception('Failed to update post');
    }
  }

  // 게시물 삭제
  static Future<void> deletePost(String postId, BuildContext context) async {
    final accessToken = await getAccessToken();
    final response = await http.delete(
      Uri.parse('$baseUrl/community/posts/$postId'),
      headers: {
        'Authorization': 'Bearer $accessToken',
      },
    );

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('게시물이 삭제되었습니다.'))
      );
    } else {
      throw Exception('Failed to delete post');
    }
  }

  // 게시물 좋아요 추가/취소
  static Future<void> toggleLikePost(String postId, BuildContext context) async {
    final accessToken = await getAccessToken();
    final response = await http.post(
      Uri.parse('$baseUrl/posts/$postId/like'),
      headers: {'Authorization': 'Bearer $accessToken'},
    );

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Like toggled successfully')));
    } else {
      throw Exception('Failed to toggle like. Status code: ${response.statusCode}');
    }
  }
}
