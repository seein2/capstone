# 감정 분석 AI 일기장 & 커뮤니티 서비스

## 📝 프로젝트 소개
사용자의 일기를 AI가 분석하여 감정 상태를 파악하고, 맞춤형 응답과 컨텐츠를 제공하는 서비스입니다. 또한 비슷한 감정을 가진 사용자들이 소통할 수 있는 커뮤니티 기능을 제공합니다.

## ⚡️ 주요 기능
### 1. AI 감정 분석 일기
- 사용자가 작성한 일기의 감정을 AI가 분석 (슬픔, 불안, 분노, 행복, 당황)
- 분석된 감정을 수치화하여 시각화
- GPT-4 기반의 맞춤형 코멘트 제공

### 2. 맞춤형 컨텐츠 추천
- 주간 감정 변화 추이 분석
- 주요 감정에 따른 맞춤형 컨텐츠 추천
  - 음악 추천
  - 도서 추천
  - 영상 추천

### 3. 커뮤니티
- 사용자들 간 공감대 형성이 가능한 커뮤니티 게시판 기능
- 좋아요,댓글,검색 기능

## 🛠 기술 스택
- **Backend**: Node.js, flask
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
POST /diary/analyze - 일기 작성 및 코멘트 반환
GET /diary/diaries/:userId - 특정 날짜의 일기 조회
GET /diary/diaries - 전체 일기 목록 조회

GET /recommend - 맞춤 컨텐츠 추천
GET /recommend/getrecommend - 감정 변화 추이 조회

POST /community/create - 게시글 작성
GET /community/posts - 게시글 목록 조회
PUT /community/posts/:id - 게시글 수정
DELETE /community/posts/:id - 게시글 삭제
POST /community/posts/:id/like - 게시글 좋아요 및 취소

GET /profile/profile - 프로필 정보
PUT /profile/profile/edit - 프로필 수정
```