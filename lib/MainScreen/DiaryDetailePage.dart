import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DiaryDetailPage extends StatelessWidget {
  final DateTime date;
  final String content;

  const DiaryDetailPage({Key? key, required this.date, required this.content}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('일기 상세'),
        backgroundColor: Colors.blue,
      ),
      body: SingleChildScrollView(
        child: Container( // 여기에서 Container 추가
          padding: EdgeInsets.all(16.0), // 패딩 적용
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                '날짜: ${DateFormat('yyyy년 MM월 dd일').format(date)}',
                style: TextStyle(fontSize: 20),
              ),
              SizedBox(height: 20),
              Text(
                '내용:',
                style: TextStyle(fontSize: 20),
              ),
              SizedBox(height: 10),
              Text(
                content,
                style: TextStyle(fontSize: 18),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
