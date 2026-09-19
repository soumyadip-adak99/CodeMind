package com.codeMind.backend.services;

import com.codeMind.backend.dto.request.CreateChatSessionRequest;
import com.codeMind.backend.dto.response.ChatSessionResponse;
import com.codeMind.backend.entity.ChatSession;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

public interface ChatService {

    ChatSessionResponse createSession(UUID userId, CreateChatSessionRequest request);

    List<ChatSessionResponse> listSessions(UUID userId, UUID repoId);

    ChatSession requiredSession(UUID userId, UUID sessionId);

    SseEmitter streamReply(UUID userId, UUID sessionId, String userContent);
}
