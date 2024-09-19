import 'package:flutter/material.dart';

class UserInfo {
  final String userId;
  final bool isAdmin;

  UserInfo({required this.userId, required this.isAdmin});

  factory UserInfo.fromJson(Map<String, dynamic> json) {
    return UserInfo(
      userId: json['userId'] as String,
      isAdmin: json['isAdmin'] as bool,
    );
  }
}

// 프로필 정보 모델
class ProfileInfo {
  final String nickname;
  final String communityNickname;
  final String profileImage;
  final bool isProfileComplete;

  ProfileInfo({required this.nickname, required this.communityNickname, required this.profileImage, required this.isProfileComplete});

  factory ProfileInfo.fromJson(Map<String, dynamic> json) {
    return ProfileInfo(
      nickname: json['nickname'] as String,
      communityNickname: json['community_nickname'] as String,
      profileImage: json['profile_image'],
      isProfileComplete: json['is_profile_complete'] as bool,
    );
  }
}