import 'package:flutter/material.dart';
import 'package:example/MainScreen/CommunityPage.dart';
import 'package:flutter/services.dart';
import 'package:kakao_flutter_sdk_user/kakao_flutter_sdk_user.dart';
import 'package:kakao_flutter_sdk/kakao_flutter_sdk.dart';
import 'package:kakao_flutter_sdk_talk/kakao_flutter_sdk_talk.dart';
import 'package:provider/provider.dart';
import '../MainScreen/ProfileSettingPage.dart';
import '../settingScreen/NicknamePage.dart';


void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // 카카오 SDK 초기화
  KakaoSdk.init(
    nativeAppKey: '236a42e6bb6f19106c3547d238a9cee2',
    javaScriptAppKey: 'd9311df67c81776a8dae575570fdd7f7',
  );

  runApp(
    // MultiProvider로 Provider들을 전역에서 사용할 수 있도록 설정
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => NicknameProvider()), // 닉네임 Provider 등록
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      // 앱 루트 화면을 SplashScreen으로 설정
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late AnimationController _textController; // MooD 애니메이션을 위한 컨트롤러
  late AnimationController _overlayController; // 오버레이 애니메이션을 위한 컨트롤러
  late Animation<Offset> _animation; // MooD 텍스트의 위치 애니메이션
  late Animation<double> _opacityAnimation; // 오버레이의 투명도 애니메이션
  bool _showOverlay = false;

  @override
  void initState() {
    super.initState();
    _textController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _overlayController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _animation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _textController,
      curve: Curves.easeInOut,
    ));

    _opacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _overlayController,
      curve: Curves.easeInOut,
    ));

    _textController.forward().whenComplete(() {
      setState(() {
        _showOverlay = true;
      });
      _overlayController.forward();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(
              'assets/images/MainBackground.png',
              fit: BoxFit.cover,
            ),
          ),
          Center(
            child: SlideTransition(
              position: _animation,
              child: Padding(
                padding: const EdgeInsets.only(bottom: 450),
                child: Text(
                  'MooD',
                  style: TextStyle(
                    color: const Color(0xFFFFF8DE),
                    fontSize: 70,
                    fontFamily: 'YClover',
                  ),
                ),
              ),
            ),
          ),
          if (_showOverlay)
            Positioned.fill(
              child: FadeTransition(
                opacity: _opacityAnimation,
                child: Container(
                  color: const Color(0x80000E2F),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20.0),
                        child: Text(
                          '일기를 작성하여 \n'
                              '자신의 감정을 표현하고\n'
                              '기분 패턴을 쉽게 추적하세요.\n'
                              '당신의 손끝으로 맞춤형 지원을\n'
                              '제공해드립니다.',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: const Color(0xFFFFF8DE),
                            fontSize: 18,
                          ),
                        ),
                      ),
                      const SizedBox(height: 160),
                      InkWell(
                        onTap: () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(builder: (context) => ProfileSettingPage()),
                          );
                        },
                        child: Container(
                          width: 200,
                          height: 50,
                          decoration: BoxDecoration(
                            image: DecorationImage(
                              image: AssetImage('assets/images/kakao_login.png'),
                              fit: BoxFit.cover,
                            ),
                            borderRadius: BorderRadius.circular(4.0),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
