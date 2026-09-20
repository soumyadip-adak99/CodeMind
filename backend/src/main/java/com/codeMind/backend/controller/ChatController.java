package com.codeMind.backend.controller;

import com.codeMind.backend.dto.request.ChatMessageRequest;
import com.codeMind.backend.dto.request.CreateChatSessionRequest;
import com.codeMind.backend.dto.response.ChatMessageResponse;
import com.codeMind.backend.dto.response.ChatSessionResponse;
import com.codeMind.backend.security.CurrentUser;
import com.codeMind.backend.services.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat/sessions")
@RequiredArgsConstructor
public class ChatController {

    private final CurrentUser currentUser;
    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatSessionResponse> createSession(@Valid @RequestBody CreateChatSessionRequest request) {
        UUID userId = currentUser.require().getId();
        return ResponseEntity.ok(chatService.createSession(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<ChatSessionResponse>> listSession(@RequestParam UUID repositoryId) {
        UUID userId = currentUser.require().getId();
        return ResponseEntity.ok(chatService.listSessions(userId, repositoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<ChatMessageResponse>> getMessage(@PathVariable UUID id) {
        UUID userId = currentUser.require().getId();
        return ResponseEntity.ok(chatService.getMessages(userId, id));
    }

    @PostMapping(value = "/{id}/messages", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> sendMessage(@PathVariable UUID id, @Valid @RequestBody ChatMessageRequest request) {
        UUID userId = currentUser.require().getId();
        return ResponseEntity.ok(chatService.streamReply(userId, id, request.getContent()));
    }
}
