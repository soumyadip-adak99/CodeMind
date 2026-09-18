package com.codeMind.backend.services.ai;

import com.codeMind.backend.dto.CitationDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RetrievedContext {
    List<CitationDto> citations;
    String contextText;
}
