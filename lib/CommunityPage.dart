import 'package:flutter/material.dart';
import 'package:flutter_calendar_app/WritePostPage.dart';
import 'package:flutter_calendar_app/models/user.dart';
import 'PostPage.dart'; // Import PostPage
import 'API/APIService.dart'; // API Service 가져오기
import 'models/post.dart'; // Post 모델 클래스 가져오기
import 'package:intl/intl.dart';

class CommunityPage extends StatefulWidget {
  const CommunityPage({Key? key}) : super(key: key);

  @override
  _CommunityPageState createState() => _CommunityPageState();
}

class _CommunityPageState extends State<CommunityPage> {
  late Future<List<Post>> _futurePosts;  // 비동기적으로 게시물 목록을 저장할 변수
  String? communityNickname;

  @override
  void initState() {
    super.initState();
    _futurePosts = ApiService.getPosts(context);  // 초기화 시점에 게시물 목록을 로드
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          '커뮤니티',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Color(0xFFFFF8DE),
          ),
        ),
        backgroundColor: Color(0xFF171C46),
        elevation: 0,
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() {
                _futurePosts = ApiService.getPosts(context);  // 게시물 새로고침
              });
            },
          ),
        ],
      ),

      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/CommunityBackground.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: FutureBuilder<List<Post>>(
          future: _futurePosts,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('오류: ${snapshot.error}'));
            } else if (snapshot.hasData) {
              return ListView.builder(
                itemCount: snapshot.data!.length,
                itemBuilder: (context, index) {
                  final post = snapshot.data![index];
                  return Card(
                    color: Color(0xFFB5C3E8),
                    margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
                    child: ListTile(
                      title: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            post.nickname ?? '작성자 없음', // 커뮤니티 닉네임 표시
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(height: 4),  // 닉네임과 제목 사이 간격
                          Text(post.title ?? '제목 없음'),
                        ],
                      ),
                      subtitle: Text(post.content ?? '내용 없음'),
                      trailing: Text(post.timeAgo ?? '날짜 정보 없음'),
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => PostPage(post: post),
                          ),
                        );
                      },
                    ),
                  );
                },
              );
            } else {
              return const Center(child: Text('게시물이 없습니다.'));
            }
          },
        ),
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 100.0),
        child: FloatingActionButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => Writepostpage()),
            );
          },
          child: Icon(Icons.add),
          backgroundColor: Theme.of(context).primaryColor,
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endDocked,
    );
  }
}