package com.example.mentalcare.ui.diary

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class DiaryModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is Diary Fragment"
    }
    val text: LiveData<String> = _text
}
