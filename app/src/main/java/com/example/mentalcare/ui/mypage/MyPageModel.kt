package com.example.mentalcare.ui.mypage

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class MyPageModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is MyPage Fragment"
    }
    val text: LiveData<String> = _text
}
