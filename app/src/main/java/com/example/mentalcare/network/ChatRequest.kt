package com.example.mentalcare.network

data class ChatRequest(
    val model: String = "gpt-3.5-turbo",
    val messages: List<Message>,  // 대화 메시지 리스트
    val max_tokens: Int,
    val temperature: Double
)

data class Message(  // 중복 제거 후, 하나의 Message 클래스 사용
    val role: String,
    val content: String
)