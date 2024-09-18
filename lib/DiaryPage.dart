import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import 'WriteDiary.dart';

class DiaryPage extends StatefulWidget {
  const DiaryPage({Key? key}) : super(key: key);

  @override
  _DiaryPageState createState() => _DiaryPageState();
}

class _DiaryPageState extends State<DiaryPage> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  Map<DateTime, String> diaryEntries = {}; // Stores diary entries for each date
  String? _cardTitle = "카드의 제목";  // 카드 제목 상태 관리
  String? _cardContent = "카드 내용이 여기에 들어갑니다.";  // 카드 내용 상태 관리

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '감정일기',
          style: TextStyle(
            color: Color(0xFFFFF8DE), // FFF8DE 색상
            fontWeight: FontWeight.bold, // Bold 적용
          ),
        ),
        backgroundColor: Color(0xFF171C46),
        elevation: 0, // 그림자 제거
        automaticallyImplyLeading: false, // 뒤로 가기 아이콘 제거
        centerTitle: true, // 제목을 중앙으로 정렬
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
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: Color(0xFF343A58), // 지정된 색상으로 변경
                    borderRadius: BorderRadius.circular(15), // 굴곡 15
                  ),
                  child: TableCalendar(
                    firstDay: DateTime.utc(2000, 1, 1),
                    lastDay: DateTime.utc(2050, 12, 31),
                    focusedDay: _focusedDay,
                    selectedDayPredicate: (day) {
                      return isSameDay(_selectedDay, day);
                    },
                    onDaySelected: (selectedDay, focusedDay) {
                      setState(() {
                        _selectedDay = selectedDay;
                        _focusedDay = focusedDay;
                      });
                    },
                    calendarFormat: CalendarFormat.month,
                    onFormatChanged: (format) {
                      // Format change logic here if needed
                    },
                    onPageChanged: (focusedDay) {
                      _focusedDay = focusedDay;
                    },
                    // 캘린더 스타일 설정
                    calendarStyle: CalendarStyle(
                      defaultTextStyle: TextStyle(color: Color(0xFFFFF8DE)), // 기본 날짜 텍스트 색상
                      weekendTextStyle: TextStyle(color: Color(0xFFFFF8DE)), // 주말 텍스트 색상
                      todayTextStyle: TextStyle(
                        color: Colors.black, // 오늘 날짜 텍스트 색상
                        fontWeight: FontWeight.bold,
                      ),
                      selectedTextStyle: TextStyle(
                        color: Colors.black, // 선택된 날짜 텍스트 색상
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    headerStyle: HeaderStyle(
                      formatButtonVisible: false, // 포맷 변경 버튼 비활성화
                      titleTextStyle: TextStyle(
                        color: Color(0xFFFFF8DE), // 달 이름 텍스트 색상
                        fontSize: 20.0,
                      ),
                      leftChevronIcon: Icon(
                        Icons.chevron_left,
                        color: Color(0xFFFFF8DE), // 왼쪽 화살표 색상
                      ),
                      rightChevronIcon: Icon(
                        Icons.chevron_right,
                        color: Color(0xFFFFF8DE), // 오른쪽 화살표 색상
                      ),
                    ),
                    daysOfWeekStyle: DaysOfWeekStyle(
                      weekdayStyle: TextStyle(color: Color(0xFFFFF8DE)), // 평일 요일 텍스트 색상
                      weekendStyle: TextStyle(color: Color(0xFFFFF8DE)), // 주말 요일 텍스트 색상
                    ),
                  ),
                ),
                const SizedBox(height: 8.0),
              ],
            ),
          ),
        ],
      ),
      // 오른쪽 아래에 '+' 버튼 추가, 위치 조정을 위해 Padding 사용
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 100.0), // 위로 100만큼 이동
        child: FloatingActionButton(
          onPressed: () {
            // '+' 버튼을 눌렀을 때 WriteDiary 페이지로 이동
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => Writediary(), // WriteDiary 화면 호출
              ),
            );
          },
          child: Icon(Icons.add, color: Color(0xFFFFF8DE),), // '+' 아이콘 설정
          backgroundColor: Color(0xFF2B313F), // 버튼 색상 설정
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endDocked, // 기본 위치에서 수정
    );
  }
}
