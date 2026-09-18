package com.codeMind.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitationDto {
    private String filePath;
    private Integer startLine;
    private Integer endLine;
    private String language;
}
