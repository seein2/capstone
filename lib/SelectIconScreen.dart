import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart'; // Fluttertoast 패키지 추가


class IconSelectionScreen extends StatelessWidget {
  final List<IconData> icons = [
    Icons.home,
    Icons.star,
    Icons.favorite,
    Icons.person,
    Icons.settings,
    Icons.camera,
    Icons.access_alarm,
    Icons.accessibility,
    Icons.ac_unit,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('아이콘 선택하기'),
        centerTitle: true,
      ),
      body: GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3, // 3열로 구성
          childAspectRatio: 1,
        ),
        itemCount: icons.length,
        itemBuilder: (context, index) {
          return GestureDetector(
            onTap: () {
              Navigator.pop(context, icons[index]); // 선택한 아이콘 반환
            },
            child: Card(
              child: Center(
                child: Icon(icons[index], size: 50),
              ),
            ),
          );
        },
      ),
    );
  }
}
