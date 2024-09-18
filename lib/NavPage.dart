import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_calendar_app/settingScreen/SettingPage.dart';
import 'CommunityPage.dart';
import 'DiaryPage.dart';
import 'settingScreen/SettingPage.dart';

class Navpage extends StatefulWidget {
  @override
  _NavpageState createState() => _NavpageState();
}

class _NavpageState extends State<Navpage> {
  int _selectedIndex = 0;

  List<Widget> _widgetOptions = [
    CommunityPage(),
    DiaryPage(),
    SettingsScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3, // 탭의 개수
      child: Scaffold(
        extendBody: true,
        body: _widgetOptions.elementAt(_selectedIndex),
        bottomNavigationBar: ClipRRect(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(30), // 왼쪽 위 모서리 둥글게
            topRight: Radius.circular(30), // 오른쪽 위 모서리 둥글게
          ),
          child: Container(
            color: const Color(0xff353851), // 배경색 설정
            height: 80,
            child: TabBar(
              indicatorColor: const Color(0xFFF9EDC3), // 선택된 탭 인디케이터 색상
              unselectedLabelColor: Colors.white, // 선택되지 않은 탭 색상
              labelColor: const Color(0xFFF9EDC3), // 선택된 탭 색상
              tabs: const [
                Tab(icon: Icon(Icons.home)),
                Tab(icon: Icon(Icons.note)),
                Tab(icon: Icon(Icons.settings),)
              ],
              onTap: _onItemTapped, // 탭 클릭 시 인덱스 변경
            ),
          ),
        ),
      ),
    );
  }
}
