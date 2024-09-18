import 'package:flutter/material.dart';

class InquiryFormScreen extends StatefulWidget {
  @override
  _InquiryFormScreenState createState() => _InquiryFormScreenState();
}

class _InquiryFormScreenState extends State<InquiryFormScreen> {
  final TextEditingController _inquiryController = TextEditingController();
  String? _selectedTopic;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('문의하기', style: TextStyle(color: Color(0xFFFFF8DE))),
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
          padding: EdgeInsets.all(20),
          children: [
            DropdownButtonFormField<String>(
              value: _selectedTopic,
              decoration: InputDecoration(
                labelText: '사항',
                labelStyle: TextStyle(color: Color(0xFFFFF8DE)), // Added color to label
                border: OutlineInputBorder(),
              ),
              hint: Text('사유를 선택하세요.', style: TextStyle(color: Color(0xFFFFF8DE))),
              items: <String>[
                '서비스 문제',
                '결제 문제',
                '기타',
              ].map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedTopic = value!;
                });
              },
            ),
            SizedBox(height: 20),
            TextField(
              controller: _inquiryController,
              maxLines: 5,
              style: TextStyle(color: Color(0xFFFFF8DE)), // Set text color
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: '내용을 입력하세요.',
                hintStyle: TextStyle(color: Color(0xFFFFF8DE)), // Set hint text color
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                foregroundColor: Color(0xFFFFF8DE), backgroundColor: Colors.blue,
              ),
              onPressed: () => _submitInquiry(),
              child: Text('완료'),
            ),
          ],
        ),
      ),
    );
  }

  void _submitInquiry() {
    if (_selectedTopic != null && _inquiryController.text.isNotEmpty) {
      // 서버로 데이터 전송하는 로직을 구현하세요.
      // 성공적으로 문의가 접수된 후, 성공 메시지 다이얼로그를 보여줍니다.
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('문의 접수 완료'),
            content: Text('문의가 접수되었습니다.\n빠른 시간 내에 답변 드리겠습니다.'),
            actions: <Widget>[
              TextButton(
                child: Text('확인', style: TextStyle(color: Color(0xFFFFF8DE))),
                onPressed: () {
                  Navigator.of(context).pop(); // 다이얼로그 닫기
                },
              ),
            ],
          );
        },
      );
    } else {
      // 필요한 정보를 모두 입력하지 않았을 경우 경고 메시지를 보여줍니다.
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('입력 오류'),
            content: Text('모든 필드를 채워주세요.'),
            actions: <Widget>[
              TextButton(
                child: Text('닫기', style: TextStyle(color: Color(0xFFFFF8DE))),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          );
        },
      );
    }
  }
}
