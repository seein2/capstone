import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class Writepostpage extends StatefulWidget {
  const Writepostpage({Key? key}) : super(key: key);

  @override
  _WritediaryState createState() => _WritediaryState();
}

class _WritediaryState extends State<Writepostpage> {
  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    String formattedDate = DateFormat('yyyy년 MM월 dd일').format(DateTime.now());

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).primaryColor,
        title: Text(
          '게시물 작성',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            fontFamily: 'Inter Tight',
            color: Colors.white,
            fontSize: 22,
          ),
        ),
        centerTitle: true,
        iconTheme: IconThemeData(color: Colors.white),
      ),
      body: Stack(
        children: [
          // 배경 이미지 설정
          Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/images/Background.png'),
                fit: BoxFit.cover, // 화면을 꽉 채우도록 설정
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(formattedDate, style: Theme.of(context).textTheme.titleMedium),
                SizedBox(height: 8),
                Text('오늘은 어땠나요?', style: Theme.of(context).textTheme.titleLarge),
                SizedBox(height: 20),
                TextField(
                  controller: _controller,
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.8), // 입력창의 배경색을 반투명 흰색으로 설정
                    hintText: '오늘의 일기를 작성하세요.',
                  ),
                  maxLines: 5,
                ),
                SizedBox(height: 20),
                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context, _controller.text); // 저장 후 이전 화면으로 돌아가기
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                    ),
                    child: Text('저장하기'),
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
