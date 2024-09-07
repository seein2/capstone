package com.example.mentalcare.ui.chatbot

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.mentalcare.network.ChatRequest
import com.example.mentalcare.network.ChatResponse
import com.example.mentalcare.network.Message
import com.example.mentalcare.network.RetrofitClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ChatBotViewModel : ViewModel() {

    private val _response = MutableLiveData<String>()
    val response: LiveData<String>
        get() = _response

    fun fetchResponse(prompt: String) {
        Log.d("ChatBotViewModel", "API 호출 시작 with prompt: $prompt")

        val messages = listOf(
            Message("system", "심리상담가이며 한국어로 대답해줘."),
            Message("user", prompt)
        )

        val request = ChatRequest(
            model = "gpt-3.5-turbo",
            messages = messages,
            max_tokens = 60,
            temperature = 0.7
        )

        RetrofitClient.instance.getChatbotResponse(request).enqueue(object : Callback<ChatResponse> {
            override fun onResponse(call: Call<ChatResponse>, response: Response<ChatResponse>) {
                if (response.isSuccessful && response.body() != null) {
                    // API 응답에서 message.content 값을 가져와서 사용
                    val firstChoiceText = response.body()?.choices?.get(0)?.message?.content
                    _response.value = firstChoiceText ?: "응답 데이터가 없습니다."
                } else {
                    Log.e("ChatBotViewModel", "API 응답 오류: ${response.errorBody()?.string()}")
                    _response.value = "API 응답에 문제가 발생했습니다."
                }
            }

            override fun onFailure(call: Call<ChatResponse>, t: Throwable) {
                Log.e("ChatBotViewModel", "API 호출 실패: ${t.message}")
                _response.value = "오류가 발생했습니다: ${t.message}"
            }
        })
    }


}

