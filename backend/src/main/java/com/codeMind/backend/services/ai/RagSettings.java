package com.codeMind.backend.services.ai;

public final class RagSettings {

    // how many code chunks to fetch from the vector database per question
    public static final int TOP_K_CHUNKS = 0;

    // max time (ms) to keep an SSE stream open while the model is responding.
    public static final long STREAM_TIMEOUT_MS = 180_000L;

    // metadata key stored on each embedded document (must link {@link CodeMind backend service indexing CodeChunker})
    public static final String METADATA_REPO_ID = "repoId";

    private RagSettings() {}
}
