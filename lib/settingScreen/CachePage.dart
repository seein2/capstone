import 'package:flutter/material.dart';

class CacheClearScreen extends StatefulWidget {
  @override
  _CacheClearScreenState createState() => _CacheClearScreenState();
}

class _CacheClearScreenState extends State<CacheClearScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('캐시 삭제', style: TextStyle(color: Color(0xFFFFF8DE))),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
        backgroundColor: Colors.transparent, // AppBar 배경을 투명하게
        elevation: 0, // 그림자 제거
        flexibleSpace: Container(
          decoration: BoxDecoration(
            image: DecorationImage(
              image: AssetImage("assets/Background.png"), // 배경 이미지 설정
              fit: BoxFit.cover, // 이미지가 AppBar 영역을 꽉 채우도록
            ),
          ),
        ),
      ),
    body: Container(
      decoration: BoxDecoration(
        image: DecorationImage(
          image: AssetImage("assets/Background.png"), // 배경 이미지 경로 설정
          fit: BoxFit.cover, // 전체 배경을 커버하도록 조정
      ),
    ),
      child: ListView(
        children: [
          ListTile(
            title: Text('캐시 삭제하기', style: TextStyle(fontSize: 16, color: Color(0xFFFFF8DE))),
            trailing: TextButton(
              style: TextButton.styleFrom(
                foregroundColor: Colors.white, backgroundColor: Colors.blue, // 텍스트 및 아이콘 색상
              ),
              onPressed: clearCache, // 캐시 삭제 함수 연결
              child: Text('삭제'), // 버튼 텍스트
            ),
            onTap: () {}, // ListTile을 탭했을 때의 동작, 필요에 따라 구현
          ),
        ],
      ),
    ),
    );
  }

  void clearCache() {
    // 여기에 캐시를 삭제하는 로직을 구현하세요
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('캐시 삭제'),
          content: Text('캐시를 모두 삭제하시겠습니까?'),
          actions: <Widget>[
            TextButton(
              style: TextButton.styleFrom(
                foregroundColor: Colors.white, backgroundColor: Colors.blue, // 텍스트 및 아이콘 색상
              ),
              child: Text('취소'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              style: TextButton.styleFrom(
                foregroundColor: Colors.white, backgroundColor: Colors.blue, // 텍스트 및 아이콘 색상
              ),
              child: Text('삭제'),
              onPressed: () {
                performCacheDeletion();
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
  void performCacheDeletion() {
    // 여기에 캐시 삭제 로직 구현
    // 예를 들어, 삭제 로직 수행 후:
    showDeletionSuccessDialog(); // 삭제 성공 다이얼로그 표시
  }

  void showDeletionSuccessDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('삭제 완료'),
          content: Text('모든 캐시가 성공적으로 삭제되었습니다.'),
          actions: [
            TextButton(
              child: Text('확인'),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        );
      },
    );
  }
}