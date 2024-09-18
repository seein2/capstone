import 'package:flutter/material.dart';
import 'package:flutter_calendar_app/DiaryPage.dart';
import 'package:flutter_calendar_app/NavPage.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:intl/intl.dart';

class Writediary extends StatefulWidget {
  const Writediary({Key? key}) : super(key: key);

  @override
  _WritediaryState createState() => _WritediaryState();
}

class _WritediaryState extends State<Writediary> {
  TextEditingController _controller = TextEditingController();
  bool _isDiaryValid = true;

  void _onDiaryChanged(String value) {
    setState(() {
      _isDiaryValid = value.length <= 500;
    });
  }

  void _onSaveButtonPressed() {
    if (_controller.text.isEmpty) {
      Fluttertoast.showToast(
        msg: "일기를 작성해주세요.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.grey,
        textColor: Colors.black,
        fontSize: 15.0,
      );
    } else if (_isDiaryValid) {
      Navigator.pop(context, _controller.text);
    } else {
      Fluttertoast.showToast(
        msg: "500자 이내로 다시 작성해주세요.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.grey,
        textColor: Colors.black,
        fontSize: 16.0,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    String formattedDate = DateFormat('yyyy년 MM월 dd일').format(DateTime.now());

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,  // AppBar를 투명하게 설정
        elevation: 0,  // 그림자 제거
        title: Text(
          '일기쓰기',
          style: TextStyle(
            color: Color(0xFFFFF8DE), // FFF8DE 색상
            fontWeight: FontWeight.bold, // Bold 적용
          ),
        ),
        centerTitle: true,
        iconTheme: IconThemeData(color: Color(0xFFFFF8DE)),  // 아이콘 색상 변경
      ),
      extendBodyBehindAppBar: true,
      body: Stack(
        children: [
          // 배경 이미지 설정
          Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/images/DiaryBackground.png'),
                fit: BoxFit.cover,  // 화면을 꽉 채우도록 설정
              ),
            ),
          ),
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                SizedBox(height: 80),  // 상단 여유 공간 추가
                Text(formattedDate, style: TextStyle(color: Color(0xFFFFF8DE), fontSize: 15)),  // 날짜 텍스트 색상 변경
                SizedBox(height: 8),
                Text('오늘은 어땠나요?', style: TextStyle(color: Color(0xFFFFF8DE), fontWeight: FontWeight.bold,fontSize: 22)),  // 질문 텍스트 색상 변경
                SizedBox(height: 20),
                TextField(
                  controller: _controller,
                  onChanged: _onDiaryChanged,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: const Color(0xFF2C2E42),  // 입력창의 배경색을 반투명 흰색으로 설정
                    hintText: '오늘의 일기를 작성하세요.',
                    hintStyle: TextStyle(color: Color(0x90FFF8DE)),
                  ),
                  style: TextStyle(color: Color(0xFFFFF8DE)),
                  maxLines: 5,
                ),
                SizedBox(height: 5),
                Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    '${_controller.text.length} / 500 Bytes',
                    style: TextStyle(color: const Color(0xFFFFF8DE)),
                  ),
                ),
                SizedBox(height: 20),
                Center(
                  child: ElevatedButton(
                    onPressed: _onSaveButtonPressed,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF2C2E42),
                    ),
                    child: Text('저장하기', style: TextStyle(color: Color(0xFFFFF8DE))),  // 버튼 텍스트 색상 변경
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
