# 감정 분석 AI 일기장 & 커뮤니티 서비스

## 📝 프로젝트 소개
사용자의 일기를 AI가 분석하여 감정 상태를 파악하고, 맞춤형 응답과 컨텐츠를 제공하는 서비스입니다. 또한 비슷한 감정을 가진 사용자들이 소통할 수 있는 커뮤니티 기능을 제공합니다.

## ⚡️ 주요 기능
### 1. AI 감정 분석 일기
- 사용자가 작성한 일기의 감정을 AI가 분석 (슬픔, 불안, 분노, 행복, 당황)
- 분석된 감정을 수치화하여 시각화
- GPT-4 기반의 맞춤형 코멘트 제공

### 2. 맞춤형 컨텐츠 제공
- 주간 감정 변화 추이 분석
- 주요 감정에 따른 맞춤형 컨텐츠 제공
  - 음악 추천
  - 도서 추천
  - 영상 추천

### 3. 커뮤니티
- 사용자들 간 공감대 형성이 가능한 커뮤니티 게시판 기능
- 좋아요,댓글,검색 기능

## 🛠 기술 스택
- **Backend**: Node.js, Flask
- **Database**: MySQL
- **AI**:
  - 감정 분석: 파인튜닝된 [KcELECTRA](https://github.com/Beomi/KcELECTRA) 모델
  - 챗봇: OpenAI GPT-4
- **APIs**:
  - OpenAI API (GPT-4 기반 일기 분석 및 응답 생성)
  - 감정 분석 API (KcELECTRA 기반 감정 분석 서버)
- ***DevOps***:
  - Docker
  - Docker Compose
  - 컨테이너화된 서비스:
    - Node.js 서버 (mood_nodejs)
    - Python 감정 분석 서버 (mood_flask)

## 📊 데이터베이스 구조
### Users Table
- 사용자 정보 관리
- 커뮤니티 닉네임 및 프로필 관리

### Diaries Table
- 일기 내용
- 감정 분석 결과 (5가지 감정 수치)
- 작성 날짜

### Chatbot_responses Table
- 해당 일기의 gpt 코멘트 내용

### Posts Table
- 커뮤니티 게시글 제목
- 커뮤니티 게시글 내용
- 게시글 좋아요 수

### Comments Table
- 댓글 정보
- 댓글 작성자
- 댓글 좋아요 수

### Contents Table
- 추천 컨텐츠 타입
- 컨텐츠 제목, 크리에이터
- 음악, 도서, 영상 링크
- 감정 타입별 분류

## 🔍 주요 API 엔드포인트
```
다이어리 관련 엔드포인트
POST /diary/analyze - 일기 작성 및 분석 결과 반환
GET /diary/diaries/:userId - 특정 날짜의 일기 조회
GET /diary/diaries - 전체 일기 목록 조회
PUT /diary/diaries/update/:diaryId - 일기 수정
DELETE /diary/diaries/delete/:diaryId - 일기 삭제

추천 관련 엔드포인트
POST /recommend - 맞춤 컨텐츠 추천 받기
GET /recommend/getrecommend - 최근 추천 컨텐츠 조회

커뮤니티 관련 엔드포인트
POST /post/create - 게시글 작성
GET /post/posts - 게시글 목록 조회
PUT /post/posts/:id - 게시글 수정
DELETE /post/posts/:id - 게시글 삭제
POST /post/posts/:id/like - 게시글 좋아요 및 취소
GET /post/my-posts - 내가 작성한 게시물 목록 조회
GET /post/posts/search - 게시물 검색

댓글 관련 엔드포인트
GET /comment/posts/:postId/comments - 게시글의 댓글 조회
POST /comment/posts/:postId/comments - 댓글 작성
PUT /comment/comments/:id - 댓글 수정
DELETE /comment/comments/:id - 댓글 삭제
POST /comment/comments/:id/like - 댓글 좋아요 및 취소

프로필 관련 엔드포인트
GET /profile/user-info - 사용자 정보 확인
GET /profile/profile - 프로필 정보 조회
GET /profile/profile/setup - 프로필 설정 페이지
POST /profile/profile/setup - 프로필 설정 처리
PUT /profile/profile/edit - 프로필 수정

인증 관련 엔드포인트
POST /auth/kakao/callback - 카카오 인증 콜백
POST /auth/verify-token - 토큰 검증
POST /auth/logout - 로그아웃
DELETE /auth/delete-account - 회원 탈퇴
```

## 🏄🏻‍♂️ 주요 기능별 처리 흐름

1. **일기 작성 및 분석**
   - 사용자 일기 작성 → 감정 분석 (KcELECTRA) → GPT-4 코멘트 생성 → 결과 저장 및 반환

2. **감정 기반 컨텐츠 추천**
   - 감정 분석 결과 → 주요 감정 도출 → 감정별 컨텐츠 매칭 → 음악/도서/영상 추천

3. **커뮤니티 기능**
   - 게시글 CRUD → 좋아요/댓글

4. **데이터 분석**
   - 감정 변화 추이 분석 → 시각화 → 인사이트 제공
