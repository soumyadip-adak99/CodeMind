package com.codeMind.backend.services.ai;

import com.codeMind.backend.dto.CitationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CitationMapper {

    private final JsonMapper jsonMapper;

    public CitationDto fromDocument(Document document) {
        var meta = document.getMetadata();
        return CitationDto.builder()
                .filePath(stringVal(meta.get("filePath")))
                .startLine(intVal(meta.get("startLine")))
                .endLine(intVal(meta.get("endLine")))
                .language(stringVal(meta.get("language")))
                .build();
    }

    public String toJson(List<CitationDto> citations) {
        try {
            return jsonMapper.writeValueAsString(citations);
        } catch (Exception e) {
            log.warn("{}: ", e.getMessage());
            return "[]";
        }
    }

    public List<CitationDto> fromJson(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return Arrays.asList(jsonMapper.readValue(json, CitationDto[].class));
        } catch (Exception e) {
            log.warn("{}: ", e.getMessage());
            return List.of();
        }
    }

    private String stringVal(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private static Integer intVal(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value == null) {
            return null;
        }
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
