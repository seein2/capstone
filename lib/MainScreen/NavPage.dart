import 'package:flutter/material.dart';
import 'package:example/SettingScreen/SettingPage.dart';
import 'CommunityPage.dart';
import 'DiaryPage.dart';

class NavPage extends StatefulWidget {
  @override
  _NavPageState createState() => _NavPageState();
}

class _NavPageState extends State<NavPage> {
  int _selectedIndex = 0;

  // 페이지 위젯을 리스트로 관리
  final List<Widget> _widgetOptions = [
    CommunityPage(),
    DiaryPage(),
    SettingsScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index; // 선택된 인덱스 업데이트
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: IndexedStack(
        index: _selectedIndex,
        children: _widgetOptions,
      ),
      bottomNavigationBar: ClipRRect(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(30),
          topRight: Radius.circular(30),
        ),
        child: BottomNavigationBar(
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.note), label: 'Diary'),
            BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Settings'),
          ],
          currentIndex: _selectedIndex,
          selectedItemColor: Color(0xFFF9EDC3),
          unselectedItemColor: Colors.white,
          backgroundColor: Color(0xff353851),
          onTap: _onItemTapped,
        ),
      ),
    );
  }
}
