export function generateLayouts(numParticles: number) {
    const layout0 = new Float32Array(numParticles * 3); // x, y, z
    const layout1 = new Float32Array(numParticles * 3);
    const layout2 = new Float32Array(numParticles * 3);
    const opacities = new Float32Array(numParticles * 3); // opacities for stages 0, 1, 2

    for (let i = 0; i < numParticles; i++) {
        // --- Stage 0: Scattered (Raw files) ---
        layout0[i * 3] = (Math.random() - 0.5) * 2;
        layout0[i * 3 + 1] = (Math.random() - 0.5) * 2;
        layout0[i * 3 + 2] = (Math.random() - 0.5) * 2;
        opacities[i * 3] = 0.2 + Math.random() * 0.6; // Variable initial opacity

        // --- Stage 1: Clustered (Semantic embeddings) ---
        const cluster = Math.floor(Math.random() * 6); // 6 semantic clusters
        const angle = (cluster / 6) * Math.PI * 2;
        const radius = 0.5 + Math.random() * 0.2;
        const clusterX = Math.cos(angle) * radius;
        const clusterY = Math.sin(angle) * radius;
        
        // Spread within cluster
        layout1[i * 3] = clusterX + (Math.random() - 0.5) * 0.4;
        layout1[i * 3 + 1] = clusterY + (Math.random() - 0.5) * 0.4;
        layout1[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        opacities[i * 3 + 1] = 0.4 + Math.random() * 0.6; // Brighter in clusters

        // --- Stage 2: Retrieval (Top-K Answer) ---
        const isTopK = Math.random() < 0.08; // 8% of particles represent the relevant matched chunks
        if (isTopK) {
            // Converge into a tight central answer node
            layout2[i * 3] = (Math.random() - 0.5) * 0.15;
            layout2[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
            layout2[i * 3 + 2] = (Math.random() - 0.5) * 0.15 + 0.5; // Bring slightly forward
            opacities[i * 3 + 2] = 1.0; // Fully bright
        } else {
            // Explode outwards and dim out
            layout2[i * 3] = layout0[i * 3] * 1.8;
            layout2[i * 3 + 1] = layout0[i * 3 + 1] * 1.8;
            layout2[i * 3 + 2] = layout0[i * 3 + 2] * 1.8 - 0.5; // Push back
            opacities[i * 3 + 2] = 0.05 + Math.random() * 0.1; // Very dim
        }
    }

    return { layout0, layout1, layout2, opacities };
}
