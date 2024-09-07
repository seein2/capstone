package com.example.mentalcare.network

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    private const val BASE_URL = "https://api.openai.com/v1/"  // 엔드포인트가 '/v1/' 인지 확인
    private const val API_KEY = "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"  // 실제 API 키를 여기에 입력하세요

    val instance: ApiService by lazy {
        val client = OkHttpClient.Builder()
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("Authorization", "Bearer $API_KEY")
                    .addHeader("Content-Type", "application/json")
                    .build()
                chain.proceed(request)
            }
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)  // OkHttpClient 설정
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        retrofit.create(ApiService::class.java)
    }
}