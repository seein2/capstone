package com.example.mentalcare.network

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface ApiService {
    @Headers("Content-Type: application/json")
    @POST("chat/completions")
    fun getChatbotResponse(@Body request: ChatRequest): Call<ChatResponse>
}