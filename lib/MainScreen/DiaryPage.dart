import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import 'WriteDiary.dart';
import 'DiaryDetailePage.dart';

class DiaryPage extends StatefulWidget {
  const DiaryPage({Key? key}) : super(key: key);

  @override
  _DiaryPageState createState() => _DiaryPageState();
}

class _DiaryPageState extends State<DiaryPage> {
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  Map<DateTime, String> diaryEntries = {}; // Stores diary entries for each date
  String? _cardTitle;  // 카드 제목 상태 관리
  String? _cardContent;  // 카드 내용 상태 관리

  @override
  void initState() {
    super.initState();
    _selectedDay = DateTime.now(); // 초기 선택 날짜 설정
    _updateDiaryCard(_selectedDay!);  // 초기 카드 정보 업데이트
  }

  void _updateDiaryCard(DateTime date) {
    // 카드의 제목과 내용 업데이트 로직
    _cardTitle = DateFormat('yyyy년 MM월 dd일').format(date);
    _cardContent = diaryEntries[date] ?? "이 날에 작성된 일기가 없습니다.";
  }

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
    setState(() {
      _selectedDay = selectedDay;
      _focusedDay = focusedDay;
      _updateDiaryCard(selectedDay);  // 카드 정보 업데이트
    });
  }

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
                    color: Color(0x992C2E42), // 지정된 색상으로 변경
                    borderRadius: BorderRadius.circular(30), // 굴곡 15
                  ),
                  child: TableCalendar(
                    firstDay: DateTime.utc(2000, 1, 1),
                    lastDay: DateTime.utc(2050, 12, 31),
                    focusedDay: _focusedDay,
                    selectedDayPredicate: (day) {
                      return isSameDay(_selectedDay, day);
                    },
                    onDaySelected: _onDaySelected,
                    calendarFormat: CalendarFormat.month,
                    calendarStyle: CalendarStyle(
                      defaultTextStyle: TextStyle(color: Color(0xFFFFF8DE)),
                      weekendTextStyle: TextStyle(color: Color(0xFFFFF8DE)),
                      todayTextStyle: TextStyle(
                        color: Color(0xFFFFF8DE),
                        fontWeight: FontWeight.bold,
                      ),
                      selectedTextStyle: TextStyle(
                        color: Color(0xFFFFF8DE),
                        fontWeight: FontWeight.bold,
                      ),
                      selectedDecoration: BoxDecoration(
                        color: Color(0xFF555873), // 이 부분에서 색상 변경
                        shape: BoxShape.circle,
                      ),
                      todayDecoration: BoxDecoration(
                        color: Color(0xFF15143E),
                        shape: BoxShape.circle,
                      ),
                    ),
                    headerStyle: HeaderStyle(
                      formatButtonVisible: false,
                      titleTextStyle: TextStyle(
                        color: Color(0xFFFFF8DE),
                        fontSize: 20.0,
                      ),
                      leftChevronIcon: Icon(
                        Icons.chevron_left,
                        color: Color(0xFFFFF8DE),
                      ),
                      rightChevronIcon: Icon(
                        Icons.chevron_right,
                        color: Color(0xFFFFF8DE),
                      ),
                    ),
                    daysOfWeekStyle: DaysOfWeekStyle(
                      weekdayStyle: TextStyle(color: Color(0xFFFFF8DE)),
                      weekendStyle: TextStyle(color: Color(0xFFFFF8DE)),
                    ),
                  ),
                ),
                const SizedBox(height: 20.0),
                Container(
                  height: 150,
                  width: double.infinity,
                  child: InkWell(  // 카드를 클릭 가능하게 만드는 위젯
                    onTap: () {
                      if (_selectedDay != null) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => DiaryDetailPage(
                              date: _selectedDay!,
                              content: diaryEntries[_selectedDay!] ?? "내용 없음",
                            ),
                          ),
                        );
                      }
                    },
                    child: Card(
                      color: Color(0x502B313F),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              _cardTitle ?? "제목 없음",
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFFFF8DE),
                              ),
                            ),
                            SizedBox(height: 10),
                            Text(
                              _cardContent ?? "내용 없음",
                              style: TextStyle(
                                fontSize: 20,
                                color: Color(0xFFFFF8DE),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

              ],
            ),
          ),
        ],
      ),
      // 오른쪽 아래에 '+' 버튼 추가, 위치 조정을 위해 Padding 사용
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 100.0),
        child: FloatingActionButton(
          onPressed: () async {
            // WriteDiary 페이지에서 결과를 받습니다.
            final result = await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => Writediary(),
              ),
            );
            if (result != null && _selectedDay != null) {
              setState(() {
                // 결과를 카드 제목과 내용으로 설정
                diaryEntries[_selectedDay!] = result; // Save the diary entry
                _cardContent = result;  // Update the card content
              });
            }
          },
          child: Icon(Icons.add, color: Color(0xFFFFF8DE)),
          backgroundColor: Color(0xFF2B313F),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endDocked, // 기본 위치에서 수정
    );
  }
}
