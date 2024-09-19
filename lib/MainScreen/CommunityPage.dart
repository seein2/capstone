import 'package:flutter/material.dart';
import 'package:example/MainScreen/WritePostPage.dart'; // WritePostPage.dart 파일 경로 수정
import 'package:example/models/user.dart'; // user.dart 파일 경로 수정
import 'package:example/MainScreen/PostPage.dart'; // PostPage.dart 파일 경로 수정
import 'package:example/API/APIService.dart'; // APIService.dart 파일 경로 수정
import 'package:example/models/post.dart'; // post.dart 파일 경로 수정
import 'package:intl/intl.dart'; // intl.dart 패키지는 경로 수정 필요 없음

class CommunityPage extends StatefulWidget {
  const CommunityPage({Key? key}) : super(key: key);

  @override
  _CommunityPageState createState() => _CommunityPageState();
}

class _CommunityPageState extends State<CommunityPage> {
  late Future<List<Post>> _futurePosts;

  @override
  void initState() {
    super.initState();
    _futurePosts = ApiService.getPosts(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Mood'),
        backgroundColor: Color(0xFF1A1D44),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () {
              setState(() {
                _futurePosts = ApiService.getPosts(context);
              });
            },
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage("assets/images/CommunityBackground.png"),
            fit: BoxFit.cover, // 배경 이미지가 전체 화면을 덮도록 설정
          ),
        ),
        child: FutureBuilder<List<Post>>(
          future: _futurePosts,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text("Error: ${snapshot.error}"));
            } else if (snapshot.hasData) {
              return ListView.builder(
                itemCount: snapshot.data!.length,
                itemBuilder: (context, index) {
                  Post post = snapshot.data![index];
                  return Container(
                    margin: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                    decoration: BoxDecoration(
                      color: Color(0xFF2A2C50).withOpacity(0.8), // 카드의 반투명 배경색
                      borderRadius: BorderRadius.circular(20), // 둥근 모서리
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                backgroundColor: Colors.white,
                                radius: 20,
                                child: Icon(Icons.person, color: Colors.deepPurple, size: 30),
                              ),
                              SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  post.title ?? '제목 없음',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                              Icon(Icons.more_vert, color: Colors.white),
                            ],
                          ),
                          SizedBox(height: 8),
                          Text(
                            post.content ?? '내용 없음',
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 14,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          SizedBox(height: 16),
                          Row(
                            children: [
                              Icon(Icons.favorite, color: Colors.red, size: 20),
                              SizedBox(width: 4),
                              Text(
                                '${post.likeCount}',
                                style: TextStyle(color: Colors.white70),
                              ),
                              SizedBox(width: 16),
                              Icon(Icons.comment, color: Colors.blue, size: 20),
                              SizedBox(width: 4),
                              Text(
                                '${post.commentCount}',
                                style: TextStyle(color: Colors.white70),
                              ),
                              Spacer(),
                              Text(
                                '1시간 전', // 서버로부터 받은 시간에 맞게 표시 가능
                                style: TextStyle(color: Colors.white70),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              );
            } else {
              return Center(child: Text("게시물이 없습니다."));
            }
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => Writepostpage()),
          );
        },
        child: Icon(Icons.create, color: Colors.white),
        backgroundColor: Color(0xFF6D6EB5),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endDocked,
    );
  }
}
