package com.codeMind.backend.services.implementation;

import com.codeMind.backend.dto.request.CreateChatSessionRequest;
import com.codeMind.backend.dto.response.ChatMessageResponse;
import com.codeMind.backend.dto.response.ChatSessionResponse;
import com.codeMind.backend.entity.ChatMessage;
import com.codeMind.backend.entity.ChatSession;
import com.codeMind.backend.entity.GitHubRepository;
import com.codeMind.backend.enums.IndexStatus;
import com.codeMind.backend.enums.MessageRole;
import com.codeMind.backend.exceptions.BadRequestException;
import com.codeMind.backend.exceptions.NotFoundException;
import com.codeMind.backend.repository.ChatMessageRepository;
import com.codeMind.backend.repository.ChatSessionRepository;
import com.codeMind.backend.services.ChatService;
import com.codeMind.backend.services.GitHubRepoService;
import com.codeMind.backend.services.ai.ChatPromptBuilder;
import com.codeMind.backend.services.ai.ChatStreamHandler;
import com.codeMind.backend.services.ai.CitationMapper;
import com.codeMind.backend.services.ai.CodeContextRetriever;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final GitHubRepoService repoService;
    private final CodeContextRetriever codeContextRetriever;
    private final ChatPromptBuilder chatPromptBuilder;
    private final ChatStreamHandler chatStreamHandler;
    private final CitationMapper citationMapper;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    @Transactional
    public ChatSessionResponse createSession(UUID userId, CreateChatSessionRequest request) {
        GitHubRepository repo = repoService.requireOwned(request.getRepositoryId(), userId);

        if (repo.getIndexStatus() != IndexStatus.READY) {
            throw new BadRequestException("Repository must be indexed before chatting");
        }

        String title = request.getTitle() != null && !request.getTitle().isBlank() ? request.getTitle() : "Chat with " + repo.getFullName();

        ChatSession session = ChatSession.builder()
                .userId(userId)
                .repositoryId(repo.getId())
                .title(title)
                .build();

        session = chatSessionRepository.save(session);
        return toSessionResponse(session);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatSessionResponse> listSessions(UUID userId, UUID repoId) {
        repoService.requireOwned(repoId, userId);
        return chatSessionRepository
                .findByUserIdAndRepositoryIdOrderByCreatedAtDesc(userId, repoId)
                .stream()
                .map(this::toSessionResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ChatSession requiredSession(UUID userId, UUID sessionId) {
        return chatSessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new NotFoundException("Chat session not found"));
    }

    @Override
    public SseEmitter streamReply(UUID userId, UUID sessionId, String userContent) {
        ChatSession session = requiredSession(userId, sessionId);
        GitHubRepository repo = repoService.requireOwned(session.getRepositoryId(), userId);

        if (repo.getIndexStatus() != IndexStatus.READY) {
            throw new BadRequestException("Repository is not ready for chat");
        }

        ChatMessage userMessage = chatMessageRepository.save(ChatMessage.builder()
                .sessionId(session.getId())
                .role(MessageRole.USER)
                .content(userContent)
                .build());

        // RAG retrieval - find code chunks similar to the question
        var retrieveContext = codeContextRetriever.retrieve(repo.getId(), userContent);

        // Build LLM prompts from retrieved context  + question
        String systemPrompt = chatPromptBuilder.systemPrompt(repo.getFullName());
        String userPrompt = chatPromptBuilder.userPrompt(retrieveContext.getContextText(), userContent);

        // stream OpenAI response to the client (SSE)
        return chatStreamHandler.stream(session.getId(), toMessageResponse(userMessage), retrieveContext.getCitations(), systemPrompt, userPrompt);
    }

    private ChatSessionResponse toSessionResponse(ChatSession session) {
        return ChatSessionResponse.builder()
                .id(session.getId())
                .repositoryId(session.getRepositoryId())
                .title(session.getTitle())
                .createdAt(session.getCreatedAt())
                .build();
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .role(message.getRole())
                .citations(citationMapper.fromJson(message.getCitations()))
                .createdAt(message.getCreatedAt())
                .build();
    }
}
