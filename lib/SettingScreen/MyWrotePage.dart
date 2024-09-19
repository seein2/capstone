import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart'; // 날짜 형식 지정을 위해 intl 패키지 사용
import 'dart:async'; // Timer를 사용하기 위해 필요
import 'NicknamePage.dart';
import 'CustomsearchDelegate.dart';

class MyPostsScreen extends StatefulWidget {
  @override
  _MyPostsScreenState createState() => _MyPostsScreenState();
}

class _MyPostsScreenState extends State<MyPostsScreen> {
  Timer? timer;

  @override
  void initState() {
    super.initState();
    timer = Timer.periodic(Duration(minutes: 1), (Timer t) => setState(() {}));
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    String nickname = Provider.of<NicknameProvider>(context).nickname;

    List<Map<String, dynamic>> posts = [
      {
        "profilePic": "assets/images/profile1.jpg",
        "title": "오늘 대박이야!",
        "content": "오늘 엄청난 운을 가져올 블로그 글 작성 완료! 기분이 좋아요!",
        "time": DateTime.now().subtract(Duration(minutes: 5)),
      },
      {
        "profilePic": "assets/images/profile2.jpg",
        "title": "용기 있는 자만이",
        "content": "너무 용감하다!",
        "time": DateTime.now().subtract(Duration(days: 5)),
      }
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('내가 쓴 글', style: TextStyle(color: Color(0xFFFFF8DE))),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Color(0xFFFFF8DE)),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.search, color: Color(0xFFFFF8DE)),
            onPressed: () {
              showSearch(context: context, delegate: CustomSearchDelegate(posts));
            },
          ),
        ],
        backgroundColor: Colors.transparent, // AppBar 배경을 투명하게
        elevation: 0, // 그림자 제거
        flexibleSpace: Container(
          decoration: BoxDecoration(
            image: DecorationImage(
              image: AssetImage("assets/images/Background.png"), // 배경 이미지 설정
              fit: BoxFit.cover, // 이미지가 AppBar 영역을 꽉 채우도록
            ),
          ),
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage("assets/images/Background.png"), // 배경 이미지 경로 설정
            fit: BoxFit.cover, // 전체 배경을 커버하도록 조정
          ),
        ),
        child: ListView.builder(
          itemCount: posts.length,
          itemBuilder: (context, index) {
            String timeAgo = formatTimeAgo(posts[index]["time"]);
            return Card(
              margin: EdgeInsets.all(10),
              elevation: 5,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          backgroundImage: AssetImage(posts[index]["profilePic"]),
                          radius: 20,
                        ),
                        SizedBox(width: 10),
                        Text(
                          nickname,
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        Spacer(),
                        Text(
                          timeAgo,
                          style: TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                    SizedBox(height: 12),
                    Text(
                      posts[index]["title"],
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 6),
                    Text(
                      posts[index]["content"],
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 16),
                    ),
                    SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Icon(Icons.favorite, color: Colors.red, size: 24),
                        SizedBox(width: 4),
                        Text(
                          '${posts[index]["likes"]}',
                        ),
                        SizedBox(width: 16),
                        Icon(Icons.comment, color: Colors.blue, size: 24),
                        SizedBox(width: 4),
                        Text(
                          '${posts[index]["comments"]}',
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  String formatTimeAgo(DateTime time) {
    Duration diff = DateTime.now().difference(time);
    if (diff.inMinutes < 1) {
      return '방금 전';
    } else if (diff.inMinutes < 60) {
      return '${diff.inMinutes}분 전';
    } else if (diff.inHours < 24) {
      return '${diff.inHours}시간 전';
    } else if (diff.inDays < 7) {
      return '${diff.inDays}일 전';
    } else {
      return DateFormat('MM/dd/yyyy').format(time);
    }
  }
}
