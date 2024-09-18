import 'package:flutter/material.dart';
import 'package:flutter_calendar_app/HomePage.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'SelectIconScreen.dart';
import 'NavPage.dart';

class ProfileSettingPage extends StatefulWidget {
  @override
  _SignUpScreenState createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<ProfileSettingPage> {
  IconData _selectedIcon = Icons.image;
  TextEditingController _nicknameController = TextEditingController();
  bool _isNicknameValid = true;

  void _openIconSelection() async {
    final icon = await Navigator.push<IconData>(
      context,
      MaterialPageRoute(builder: (context) => IconSelectionScreen()),
    );
    if (icon != null) {
      setState(() {
        _selectedIcon = icon;
      });
    }
  }

  void _onNicknameChanged(String value) {
    setState(() {
      _isNicknameValid = value.length <= 20;
    });
  }

  void _onStartButtonPressed() {
    if (_nicknameController.text.isEmpty) {
      Fluttertoast.showToast(
        msg: "닉네임을 입력해주세요.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.lightBlue,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } else if (_isNicknameValid) {
      Navigator.pushReplacement(  // Changed to pushReplacement to replace the current route
        context,
        MaterialPageRoute(builder: (context) => Navpage()),  // Navigate to NavPage
      );
    } else {
      Fluttertoast.showToast(
        msg: "유효하지 않은 닉네임입니다.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      extendBodyBehindAppBar: true, // AppBar 영역 뒤로 배경 확장
      appBar: AppBar(
        backgroundColor: Colors.transparent, // AppBar 투명하게 설정
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
          color: const Color(0xFFFFF8DE), // arrow_back 아이콘 색상 변경
        ),
        title: Text(
          '프로필 설정',
          style: TextStyle(color: const Color(0xFFFFF8DE),
            fontWeight: FontWeight.bold,), // 제목 색상 변경
        ),
        centerTitle: true,
        elevation: 0, // AppBar 그림자 제거
      ),
      body: Stack(
        children: [
          // 배경 이미지
          Positioned.fill(
            child: Image.asset(
              'assets/images/Background.png',
              fit: BoxFit.cover,
            ),
          ),
          // 메인 컨텐츠
          LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: constraints.maxHeight,
                  ),
                  child: IntrinsicHeight(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          SizedBox(height: 100),
                          CircleAvatar(
                            radius: 50,
                            backgroundColor: Colors.grey[300],
                            child: Icon(_selectedIcon, size: 50, color: Colors.grey[700]),
                          ),
                          SizedBox(height: 10),
                          TextButton(
                            onPressed: _openIconSelection,
                            child: Text(
                              '아이콘 변경',
                              style: TextStyle(color: const Color(0xFFFFF8DE)),
                            ),
                          ),
                          SizedBox(height: 20),
                          Text("  닉네임",
                              style: TextStyle(color: Color(0xFFFFF8DE),
                                  fontSize: 22, fontWeight: FontWeight.bold)),
                          SizedBox(height: 10),
                          TextField(
                            controller: _nicknameController,
                            onChanged: _onNicknameChanged,
                            decoration: InputDecoration(
                              labelText: '닉네임', // '닉네임' 텍스트 추가
                              labelStyle: TextStyle(color: const Color(0x90FFF8DE)), // '닉네임' 텍스트 색상 설정
                              filled: true,
                              fillColor: const Color(0xFF353851), // 입력 칸 배경색 변경
                              border: OutlineInputBorder(),
                              suffixIcon: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  if (_isNicknameValid && _nicknameController.text.isNotEmpty)
                                    Icon(Icons.check, color: Colors.green)
                                  else
                                    Icon(Icons.clear, color: Colors.red),
                                  SizedBox(width: 8),
                                ],
                              ),
                              hintText: '입력하세요.',
                              hintStyle: TextStyle(color: Colors.white70), // 힌트 색상 변경
                            ),
                            style: TextStyle(color: Colors.white), // 입력 텍스트 색상
                          ),
                          SizedBox(height: 5),
                          Align(
                            alignment: Alignment.centerRight,
                            child: Text(
                              '${_nicknameController.text.length} / 20 Bytes',
                              style: TextStyle(color: const Color(0xFFFFF8DE)),
                            ),
                          ),
                          SizedBox(height: 50),
                          Spacer(),
                          Center(
                            child: SizedBox(
                              width: 200, // 원하는 버튼 폭을 직접 설정 (예: 250)
                              child: ElevatedButton(
                                onPressed: _onStartButtonPressed,
                                child: Text(
                                  '시작하기',
                                  style:
                                  TextStyle(
                                    color: const Color(0xFFFFF8DE), fontSize: 20// '시작하기' 글자 색상
                                  ),
                                ),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF353851), // 버튼 배경색
                                  minimumSize: Size(0, 50), // 버튼 높이만 설정, 폭은 SizedBox로 결정
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20), // 둥근 사각형 모양 설정
                                  ),
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 300),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
