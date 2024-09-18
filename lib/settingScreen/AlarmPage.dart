import 'package:flutter/material.dart';

class NotificationSettingsScreen extends StatefulWidget {
  @override
  _NotificationSettingsScreenState createState() => _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState extends State<NotificationSettingsScreen> {
  bool isNotificationEnabled = true;
  bool isDarkModeEnabled = false;
  bool isGongbangEnabled = false;
  bool isHotGamesEnabled = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('알림 설정', style: TextStyle(color: Color(0xFFFFF8DE))),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Color(0xFFFFF8DE)),
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
            SwitchListTile(
              title: Text('게시물 알림', style: TextStyle(color: Color(0xFFFFF8DE))),
              value: isNotificationEnabled,
              onChanged: (bool value) {
                setState(() {
                  isNotificationEnabled = value;
                });
              },
              activeColor: Colors.green,  // 스위치 활성화 색상을 초록색으로 설정
            ),
            Divider(),  // 구분선 추가
            SwitchListTile(
              title: Text('다크 모드', style: TextStyle(color: Color(0xFFFFF8DE))),
              value: isDarkModeEnabled,
              onChanged: (bool value) {
                setState(() {
                  isDarkModeEnabled = value;
                });
              },
              activeColor: Colors.green,  // 스위치 활성화 색상을 초록색으로 설정
            ),
            Divider(),  // 구분선 추가
            SwitchListTile(
              title: Text('공부 알림', style: TextStyle(color: Color(0xFFFFF8DE))),
              value: isGongbangEnabled,
              onChanged: (bool value) {
                setState(() {
                  isGongbangEnabled = value;
                });
              },
              activeColor: Colors.green,  // 스위치 활성화 색상을 초록색으로 설정
            ),
            Divider(),  // 구분선 추가
            SwitchListTile(
              title: Text('HOT 게시물', style: TextStyle(color: Color(0xFFFFF8DE))),
              value: isHotGamesEnabled,
              onChanged: (bool value) {
                setState(() {
                  isHotGamesEnabled = value;
                });
              },
              activeColor: Colors.green,  // 스위치 활성화 색상을 초록색으로 설정
            ),
            Divider(),
          ],
        ),
      ),
    );
  }
}
