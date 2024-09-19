import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // 날짜 형식 지정을 위해 intl 패키지 사용

class CustomSearchDelegate extends SearchDelegate {
  final List<Map<String, dynamic>> allPosts;

  CustomSearchDelegate(this.allPosts);

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: Icon(Icons.clear),
        onPressed: () {
          query = '';
        },
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.arrow_back),
      onPressed: () => close(context, null),
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    // 키워드를 포함하는 게시물 필터링
    List<Map<String, dynamic>> filteredPosts = allPosts.where((post) {
      return post['title'].toLowerCase().contains(query.toLowerCase()) ||
          post['content'].toLowerCase().contains(query.toLowerCase());
    }).toList();

    // 검색 결과 표시
    if (filteredPosts.isEmpty) {
      return Center(child: Text('검색 결과가 없습니다.'));
    }

    return ListView.builder(
      itemCount: filteredPosts.length,
      itemBuilder: (context, index) {
        return buildPostCard(filteredPosts[index]);
      },
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    return Center(child: Text('검색어를 입력해주세요.'));
  }

  Widget buildPostCard(Map<String, dynamic> post) {
    return Card(
      margin: EdgeInsets.all(10),
      elevation: 5,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundImage: AssetImage(post["profilePic"]),
                  radius: 20,
                ),
                SizedBox(width: 10),
                Text(
                  post["title"],
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Spacer(),
                Text(
                  formatTimeAgo(post["time"]),
                  style: TextStyle(color: Colors.grey),
                ),
              ],
            ),
            SizedBox(height: 12),
            Text(
              post["content"],
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 6),
            Text(
              post["content"],
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Icon(Icons.favorite, color: Colors.red, size: 24),
                SizedBox(width: 4),
                Text('${post["likes"]}'),
                SizedBox(width: 16),
                Icon(Icons.comment, color: Colors.blue, size: 24),
                SizedBox(width: 4),
                Text('${post["comments"]}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
  String formatTimeAgo(DateTime time) {
    Duration diff = DateTime.now().difference(time);
    if (diff.inMinutes < 1) {
      return '방금 전';
    } else if (diff.inMinutes < 60) {
      return '${diff.inMinutes}분 전';
    } else if (diff.inHours < 24) {
      return '${diff.inHours}시간 전';
    } else if (diff.inDays < 7) {
      return '${diff.inDays}일 전';
    } else {
      return DateFormat('MM/dd/yyyy').format(time);
    }
  }
}