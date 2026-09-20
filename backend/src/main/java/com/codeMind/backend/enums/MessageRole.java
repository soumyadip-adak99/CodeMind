package com.codeMind.backend.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum MessageRole {
    USER,
    ASSISTANT;

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }
}
