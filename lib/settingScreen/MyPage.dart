import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'NicknamePage.dart';
// 내 정보 화면 (MyInfoScreen)
class MyInfoScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Provider를 통해 닉네임 가져오기
    String currentNickname = Provider.of<NicknameProvider>(context).nickname;

    return Scaffold(
      appBar: AppBar(
        title: Text('내 정보', style: TextStyle(color: Color(0xFFFFF8DE))),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Color(0xFFFFF8DE)),
          onPressed: () {
            // 뒤로가기
            Navigator.pop(context);
          },
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
            image: AssetImage('assets/Background.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: ListView(
          padding: EdgeInsets.all(16),
          children: [
            Center(
              child: CircleAvatar(
                radius: 50,
                backgroundImage: AssetImage('assets/images/Background.png'), // 프로필 사진 경로
              ),
            ),
            SizedBox(height: 16),
            Center(
              child: ElevatedButton(
                onPressed: () {
                  // 아이콘 변경 버튼 기능
                },
                child: Text('아이콘 변경', style: TextStyle(color: Color(0xFFFFF8DE))),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
              ),
            ),
            SizedBox(height: 32),
            _buildInfoRow('닉네임', currentNickname, true, context),
            Divider(),
            _buildInfoRow('이메일', 'kog3480@gamil.com', false, context),
            Divider(),
            _buildInfoRow('생일', '2000.03.22', false, context),
            Divider(),
            _buildInfoRow('생성일', '2024.08.03', false, context),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String title, String value, bool isEditable, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFFFFF8DE))),
          Row(
            children: [
              Text(value, style: TextStyle(fontSize: 16, color: Color(0xFFFFF8DE))),
              if (isEditable)
                SizedBox(
                  width: 60,
                  height: 30,
                  child: TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => NicknameChangeScreen()),
                      );
                    },
                    child: Text('변경', style: TextStyle(color: Colors.white, fontSize: 12)),
                    style: TextButton.styleFrom(backgroundColor: Colors.blue),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
