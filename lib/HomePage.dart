import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(
              'assets/images/Background.png',
              fit: BoxFit.cover,
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              decoration: BoxDecoration(
                color: Color(0xFF353851), // 컨테이너 색상 설정
                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
              ),
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  IconButton(
                    icon: Icon(Icons.home, color: Colors.white),
                    onPressed: () {},
                    splashColor: Color(0xFFF9EDC3), // 버튼 눌림 효과 색상
                  ),
                  IconButton(
                    icon: Icon(Icons.note, color: Colors.white),
                    onPressed: () {},
                    splashColor: Color(0xFFF9EDC3),
                  ),
                  IconButton(
                    icon: Icon(Icons.brightness_2, color: Colors.white),
                    onPressed: () {},
                    splashColor: Color(0xFFF9EDC3),
                  ),
                  IconButton(
                    icon: Icon(Icons.settings, color: Colors.white),
                    onPressed: () {},
                    splashColor: Color(0xFFF9EDC3),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
