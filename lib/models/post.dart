import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/profile.dart';

class Post {
  final int id;
  final String? title;  // `String?`을 사용하여 null을 허용하게 만들 수 있음
  final String? content;
  final String? createdAt;
  final String? communityNickname;
  final String? nickname;
  final int userId;
  final int likeCount;
  final int commentCount;

  Post({required this.id, this.title, this.content,
    this.createdAt, this.communityNickname, this.nickname,
    required this.userId, required this.likeCount, required this.commentCount,});

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] ?? 0, // id는 null이 아니라고 가정, 0으로 기본값 지정
      title: json['title'],  // `as String?`을 사용하여 null이 될 수 있음을 명시
      content: json['content'],
      createdAt: json['createdAt'],
      nickname: json['nickname'],
      userId: json['userId'],
      likeCount: json['likeCount'],
      commentCount: json['commentCount'],
    );
  }

  DateTime? get getDate => createdAt != null ? DateTime.tryParse(createdAt!) : null;

  String get formattedDate {
    if (createdAt == null || createdAt!.isEmpty) {
      return '날짜 정보 없음';
    }
    try {
      final DateTime parsedDate = DateTime.parse(createdAt!);
      return DateFormat('yyyy년 MM월 dd일').format(parsedDate);
    } catch (e) {
      return '날짜 정보 없음';
    }
  }

  String get timeAgo {
    if (createdAt == null) return '날짜 정보 없음';
    DateTime postDate = DateTime.tryParse(createdAt!) ?? DateTime.now();
    Duration difference = DateTime.now().difference(postDate);

    if (difference.inDays > 1) {
      return '${difference.inDays} 일 전';
    } else if (difference.inHours > 1) {
      return '${difference.inHours} 시간 전';
    } else if (difference.inMinutes > 1) {
      return '${difference.inMinutes} 분 전';
    } else {
      return '${difference.inSeconds} 초 전';
    }
  }
}


