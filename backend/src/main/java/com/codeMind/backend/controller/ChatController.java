package com.codeMind.backend.controller;

import com.codeMind.backend.security.CurrentUser;
import com.codeMind.backend.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final CurrentUser currentUser;
    private final ChatService chatService;


}
