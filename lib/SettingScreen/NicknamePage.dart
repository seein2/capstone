import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class NicknameProvider with ChangeNotifier {
  String _nickname = "Happy";

  String get nickname => _nickname;

  void setNickname(String newNickname) {
    _nickname = newNickname;
    notifyListeners();
  }
}

class NicknameChangeScreen extends StatefulWidget {
  @override
  _NicknameChangeScreenState createState() => _NicknameChangeScreenState();
}

class _NicknameChangeScreenState extends State<NicknameChangeScreen> {
  TextEditingController _nicknameController = TextEditingController();
  bool _isValid = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('닉네임 변경', style: TextStyle(color: Color(0xFFFFF8DE))),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Color(0xFFFFF8DE)),
          onPressed: () => Navigator.pop(context),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            image: DecorationImage(
              image: AssetImage("assets/images/Background.png"),
              fit: BoxFit.cover,
            ),
          ),
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage("assets/images/Background.png"),
            fit: BoxFit.cover,
          ),
        ),
        child: ListView(
          padding: EdgeInsets.all(16.0),
          children: [
            Text(
              '기존 닉네임',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFFFFF8DE)),
            ),
            SizedBox(height: 8),
            TextField(
              enabled: false,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: Provider.of<NicknameProvider>(context).nickname,
                hintStyle: TextStyle(color: Color(0xFFFFF8DE)),
              ),
              style: TextStyle(color: Color(0xFFFFF8DE)),
            ),
            SizedBox(height: 20),
            Text(
              '바꿀 닉네임',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFFFFF8DE)),
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _nicknameController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: '입력하세요.',
                      hintStyle: TextStyle(color: Color(0xFFFFF8DE)),
                    ),
                    maxLength: 10,
                    style: TextStyle(color: Color(0xFFFFF8DE)),
                    onChanged: (value) {
                      setState(() {
                        _isValid = value.length <= 10;
                      });
                    },
                  ),
                ),
                SizedBox(width: 8),
                Icon(
                  _isValid ? Icons.check_circle : Icons.cancel,
                  color: _isValid ? Colors.green : Colors.red,
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              '${_nicknameController.text.length} / 10 Bytes',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
            SizedBox(height: 30),
            Center(
              child: ElevatedButton(
                onPressed: _isValid ? () => _showConfirmationDialog() : null,
                child: Text('완료', style: TextStyle(color: Color(0xFFFFF8DE))),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  padding: EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                  textStyle: TextStyle(color: Color(0xFFFFF8DE)),
                ),
              ),
            ),
            SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  void _showConfirmationDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('닉네임 변경 확인'),
          content: Text('닉네임을 변경하시겠습니까?'),
          actions: <Widget>[
            TextButton(
              child: Text('취소'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: Text('확인'),
              onPressed: () {
                Provider.of<NicknameProvider>(context, listen: false).setNickname(_nicknameController.text);
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}
