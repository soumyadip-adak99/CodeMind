package com.codeMind.backend.services.ai;

import com.codeMind.backend.dto.CitationDto;
import com.codeMind.backend.dto.response.ChatMessageResponse;
import com.codeMind.backend.entity.ChatMessage;
import com.codeMind.backend.enums.MessageRole;
import com.codeMind.backend.repository.ChatMessageRepository;
import org.springframework.ai.chat.model.ChatModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatStreamHandler {

    private final ChatModel chatModel;
    private final ChatMessageRepository chatMessageRepository;
    private final CitationMapper citationMapper;

    public SseEmitter stream(UUID sessionId, ChatMessageResponse saveUserMessage, List<CitationDto> citations, String systemPrompt, String userPrompt) {
        SseEmitter emitter = new SseEmitter(RagSettings.STREAM_TIMEOUT_MS);
        StringBuilder fullReply = new StringBuilder();

        try {
            emitter.send(SseEmitter.event()
                    .name("user_message")
                    .data(saveUserMessage)
            );

            ChatClient.builder(chatModel)
                    .build()
                    .prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .stream()
                    .content()
                    .doOnNext(token -> appendToken(emitter, fullReply, token))
                    .doOnError(err -> {
                        log.error("Chat stream error: {}", err.getMessage());
                        emitter.completeWithError(err);
                    })
                    .doOnComplete(() -> completeStream(emitter, sessionId, fullReply, citations))
                    .subscribe();

        } catch (IOException e) {
            emitter.completeWithError(e);
        }

        return emitter;
    }

    private void appendToken(SseEmitter emitter, StringBuilder fullReply, String token) {
        fullReply.append(token);

        try {
            emitter.send(SseEmitter.event()
                    .name("token")
                    .data(token, MediaType.APPLICATION_JSON));
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    private void completeStream(SseEmitter emitter, UUID sessionId, StringBuilder fullReply, List<CitationDto> citations) {
        try {
            ChatMessage assistant = chatMessageRepository.save(ChatMessage.builder()
                    .sessionId(sessionId)
                    .role(MessageRole.ASSISTANT)
                    .content(fullReply.toString())
                    .citations(citationMapper.toJson(citations))
                    .build());

            emitter.send(SseEmitter.event()
                    .name("assistant_message")
                    .data(toMessageResponse(assistant)));

            emitter.send(SseEmitter.event().name("done").data("[DONE]"));
            emitter.complete();
        } catch (Exception e) {
            emitter.completeWithError(e);
        }
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .role(message.getRole())
                .content(message.getContent())
                .citations(citationMapper.fromJson(message.getCitations()))
                .createdAt(message.getCreatedAt())
                .build();
    }
}
