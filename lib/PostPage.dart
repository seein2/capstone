import 'package:flutter/material.dart';
import '../models/post.dart';  // Post 모델 import
import 'package:intl/intl.dart';

class PostPage extends StatelessWidget {
  final Post post;  // Map 대신 Post 객체 사용

  const PostPage({Key? key, required this.post}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(post.title ?? '제목 없음'),
        centerTitle: true,
      ),
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/CommunityBackground.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                post.getDate != null ? DateFormat('yyyy-MM-dd HH:mm').format(DateTime.parse(post.createdAt!)) : '날짜 정보 없음',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey,
                ),
              ),
              SizedBox(height: 10),
              Text(
                post.content ?? '내용 없음',
                style: TextStyle(
                  fontSize: 18,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
