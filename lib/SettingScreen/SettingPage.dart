import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart'; // 날짜 형식 지정을 위해 intl 패키지 사용
import 'dart:async'; // Timer를 사용하기 위해 필요
import '../main.dart';

import 'MyPage.dart';
import 'NicknamePage.dart';
import 'MyWrotePage.dart';
import 'AlarmPage.dart';
import 'CachePage.dart';
import 'ContactPage.dart';
import 'ReportPage.dart';

class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Provider를 통해 현재 닉네임 상태를 가져옵니다.
    String currentNickname = Provider.of<NicknameProvider>(context).nickname;

    return Scaffold(
      appBar: AppBar(
        title: const Text('설정', style: TextStyle(color: Color(0xFFFFF8DE))),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFFFFF8DE)),
          onPressed: () {
            // 이전 화면으로 돌아가기
            Navigator.of(context).pop();
          },
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: const Image(
          image: AssetImage("assets/images/MainBackground.png"),
          fit: BoxFit.cover,
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage("assets/images/MainBackground.png"),
            fit: BoxFit.cover,
          ),
        ),
        child: ListView(
          children: <Widget>[
            buildSectionTitle(context, '계정'),
            buildListTile(
              context,
              '내 정보',
              currentNickname,
                  () => Navigator.push(context, MaterialPageRoute(builder: (context) => MyInfoScreen())),
            ),
            buildListTile(
              context,
              '내가 쓴 글',
              '',
                  () => Navigator.push(context, MaterialPageRoute(builder: (context) => MyPostsScreen())),
            ),
            const Divider(),
            buildSectionTitle(context, '앱 설정'),
            buildListTile(
              context,
              '알람 설정',
              '',
                  () => Navigator.push(context, MaterialPageRoute(builder: (context) => NotificationSettingsScreen())),
            ),
            buildListTile(
              context,
              '캐시 삭제',
              '',
                  () => Navigator.push(context, MaterialPageRoute(builder: (context) => CacheClearScreen())),
            ),
            const Divider(),
            buildSectionTitle(context, '기타'),
            buildListTile(
              context,
              '문의하기',
              '',
                  () => Navigator.push(context, MaterialPageRoute(builder: (context) => InquiryFormScreen())),
            ),
            buildListTile(
              context,
              '신고하기',
              '',
                  () => Navigator.push(context, MaterialPageRoute(builder: (context) => ReportPage())),
            ),
            buildAppVersion(context),
            logoutButton(context),
          ],
        ),
      ),
    );
  }

  Widget buildSectionTitle(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFFFF8DE))),
    );
  }

  Widget buildListTile(BuildContext context, String title, String subtitle, VoidCallback onTap) {
    return ListTile(
      title: Text(title, style: const TextStyle(color: Color(0xFFFFF8DE))),
      subtitle: Text(subtitle, style: const TextStyle(color: Color(0xFFFFF8DE))),
      onTap: onTap,
    );
  }

  Widget buildAppVersion(BuildContext context) {
    return ListTile(
      title: const Text('앱 버전', style: TextStyle(color: Color(0xFFFFF8DE))),
      subtitle: const Text('7.0.34(2024081216)', style: TextStyle(color: Colors.grey)),
    );
  }

  Widget logoutButton(BuildContext context) {
    return Center(
      child: ElevatedButton(
        onPressed: () {
          // 로그아웃 로직 추가 예정
        },
        child: const Text('로그아웃', style: TextStyle(color: Color(0xFFFFF8DE))),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blue,
          padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
        ),
      ),
    );
  }
}
