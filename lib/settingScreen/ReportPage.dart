import 'package:flutter/material.dart';

class ReportPage extends StatefulWidget {
  @override
  _ReportPageState createState() => _ReportPageState();
}

class _ReportPageState extends State<ReportPage> {
  final _reportTypes = ['서비스 문제', '사용자 문제', '기타'];
  String? _selectedType;
  final TextEditingController _detailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('신고하기', style: TextStyle(color: Color(0xFFFFF8DE))),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Color(0xFFFFF8DE)),
          onPressed: () => Navigator.of(context).pop(),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            image: DecorationImage(
              image: AssetImage("assets/Background.png"),
              fit: BoxFit.cover,
            ),
          ),
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage("assets/Background.png"),
            fit: BoxFit.cover,
          ),
        ),
        child: ListView(
          padding: EdgeInsets.all(20),
          children: [
            DropdownButtonFormField<String>(
              value: _selectedType,
              decoration: InputDecoration(
                labelText: '사유',
                labelStyle: TextStyle(color: Color(0xFFFFF8DE)), // Added color to label
                border: OutlineInputBorder(),
              ),
              hint: Text('사유를 선택하세요.', style: TextStyle(color: Color(0xFFFFF8DE))),
              items: _reportTypes.map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedType = value!;
                });
              },
            ),
            SizedBox(height: 20),
            TextField(
              controller: _detailController,
              maxLines: 10,
              style: TextStyle(color: Color(0xFFFFF8DE)), // Set text color
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: '주요 내용을 입력하세요.',
                hintStyle: TextStyle(color: Color(0xFFFFF8DE)), // Set hint text color
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                foregroundColor: Color(0xFFFFF8DE), backgroundColor: Colors.blue,
              ),
              onPressed: _submitReport,
              child: Text('완료'),
            ),
          ],
        ),
      ),
    );
  }

  void _submitReport() {
    if (_selectedType != null && _detailController.text.isNotEmpty) {
      // Handle report submission logic here.

      // Display success dialog.
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('신고 접수 완료'),
            content: Text('신고가 접수되었습니다.\n빠른 시간 내에 처리하겠습니다.'),
            actions: <Widget>[
              TextButton(
                child: Text('확인', style: TextStyle(color: Color(0xFFFFF8DE))),
                onPressed: () {
                  Navigator.of(context).pop(); // Close the dialog
                },
              ),
            ],
          );
        },
      );
    } else {
      // If necessary information is not filled, show an error message dialog.
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
