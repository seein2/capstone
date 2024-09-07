package com.example.mentalcare.ui.chatbot

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import com.example.mentalcare.databinding.FragmentChatbotBinding

class ChatBotFragment : Fragment() {

    private var _binding: FragmentChatbotBinding? = null
    private val binding get() = _binding!!

    private val chatBotViewModel: ChatBotViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentChatbotBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // ViewModel의 response를 관찰하여 UI를 업데이트하는 코드
        chatBotViewModel.response.observe(viewLifecycleOwner, Observer { response ->
            Log.d("ChatBotFragment", "Response received and updating UI: $response")  // 응답 수신 확인
            binding.textChatbot.text = response  // UI 업데이트
        })

        // 버튼 클릭 이벤트
        binding.sendButton.setOnClickListener {
            val prompt = binding.editText.text.toString()
            Log.d("ChatBotFragment", "Send button clicked with prompt: $prompt")  // 버튼 클릭 로그 추가
            chatBotViewModel.fetchResponse(prompt)
        }
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
