import { generateLayouts } from "./layouts";

interface FieldOptions {
    canvas: HTMLCanvasElement;
    numParticles?: number;
    isDark?: boolean;
}

export class FieldEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private numParticles: number;
    private isDark: boolean;

    private layout0: Float32Array;
    private layout1: Float32Array;
    private layout2: Float32Array;
    private opacities: Float32Array;

    private currentPositions: Float32Array;
    private currentOpacities: Float32Array;

    private scrollProgress: number = 0;
    private targetScrollProgress: number = 0;
    
    private pointerX: number = 0;
    private pointerY: number = 0;
    private targetPointerX: number = 0;
    private targetPointerY: number = 0;

    private width: number = 0;
    private height: number = 0;
    private dpr: number = 1;

    private isRunning: boolean = false;
    private animationId: number = 0;
    private time: number = 0;

    constructor({ canvas, numParticles = 2000, isDark = true }: FieldOptions) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
        if (!ctx) throw new Error("Could not get 2d context");
        this.ctx = ctx;
        this.numParticles = numParticles;
        this.isDark = isDark;

        const { layout0, layout1, layout2, opacities } = generateLayouts(numParticles);
        this.layout0 = layout0;
        this.layout1 = layout1;
        this.layout2 = layout2;
        this.opacities = opacities;

        this.currentPositions = new Float32Array(numParticles * 3);
        this.currentOpacities = new Float32Array(numParticles);

        this.resize();
    }

    public setScrollProgress(progress: number) {
        this.targetScrollProgress = Math.max(0, Math.min(1, progress));
    }

    public setPointer(x: number, y: number) {
        // Normalized pointer coordinates [-1, 1]
        this.targetPointerX = (x / this.width) * 2 - 1;
        this.targetPointerY = (y / this.height) * 2 - 1;
    }

    public setTheme(isDark: boolean) {
        this.isDark = isDark;
    }

    public resize() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        
        this.ctx.scale(this.dpr, this.dpr);
    }

    public start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.loop();
    }

    public stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    private ease(t: number) {
        // cubic-bezier(0.22, 1, 0.36, 1) approximation
        return 1 - Math.pow(1 - t, 3);
    }

    private lerp(start: number, end: number, amt: number) {
        return (1 - amt) * start + amt * end;
    }

    private loop = () => {
        if (!this.isRunning) return;

        this.time += 0.005;

        // Smoothly interpolate scroll and pointer
        this.scrollProgress = this.lerp(this.scrollProgress, this.targetScrollProgress, 0.05);
        this.pointerX = this.lerp(this.pointerX, this.targetPointerX, 0.05);
        this.pointerY = this.lerp(this.pointerY, this.targetPointerY, 0.05);

        this.updateParticles();
        this.draw();

        this.animationId = requestAnimationFrame(this.loop);
    };

    private updateParticles() {
        // Determine stage blends based on scroll progress (0 to 1)
        // Stage 0 -> 1 happens from 0.0 to 0.5
        // Stage 1 -> 2 happens from 0.5 to 1.0
        
        let blend01 = 0;
        let blend12 = 0;

        if (this.scrollProgress < 0.5) {
            blend01 = this.ease(this.scrollProgress * 2);
        } else {
            blend01 = 1;
            blend12 = this.ease((this.scrollProgress - 0.5) * 2);
        }

        // Ambient drift
        const driftX = Math.sin(this.time) * 0.05;
        const driftY = Math.cos(this.time * 0.8) * 0.05;

        for (let i = 0; i < this.numParticles; i++) {
            const idx3 = i * 3;
            
            // Interpolate positions
            let x = this.lerp(this.layout0[idx3], this.layout1[idx3], blend01);
            let y = this.lerp(this.layout0[idx3 + 1], this.layout1[idx3 + 1], blend01);
            let z = this.lerp(this.layout0[idx3 + 2], this.layout1[idx3 + 2], blend01);

            if (blend12 > 0) {
                x = this.lerp(x, this.layout2[idx3], blend12);
                y = this.lerp(y, this.layout2[idx3 + 1], blend12);
                z = this.lerp(z, this.layout2[idx3 + 2], blend12);
            }

            // Interpolate opacities
            let op = this.lerp(this.opacities[idx3], this.opacities[idx3 + 1], blend01);
            if (blend12 > 0) {
                op = this.lerp(op, this.opacities[idx3 + 2], blend12);
            }

            // Add ambient drift and pointer parallax
            // Closer particles (z > 0) move more with parallax
            const parallaxScale = (z + 1.5) * 0.05;
            x += driftX * (z + 1) + (this.pointerX * parallaxScale * -1);
            y += driftY * (z + 1) + (this.pointerY * parallaxScale * -1);

            this.currentPositions[idx3] = x;
            this.currentPositions[idx3 + 1] = y;
            this.currentPositions[idx3 + 2] = z;
            this.currentOpacities[i] = op;
        }
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Base coordinate space is [-1, 1], map to canvas
        const scale = Math.min(this.width, this.height) * 0.45;
        const cx = this.width * 0.5;
        const cy = this.height * 0.5;

        if (this.isDark) {
            this.ctx.globalCompositeOperation = "lighter";
            this.ctx.fillStyle = "rgba(168, 85, 247, 1)"; // Purple-ish base tint
        } else {
            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.fillStyle = "rgba(100, 116, 139, 1)"; // Slate tint
        }

        const baseParticleSize = this.isDark ? 2.5 : 2.0;

        this.ctx.beginPath();
        for (let i = 0; i < this.numParticles; i++) {
            const idx3 = i * 3;
            const x = this.currentPositions[idx3] * scale + cx;
            const y = this.currentPositions[idx3 + 1] * scale + cy;
            const z = this.currentPositions[idx3 + 2];
            const op = this.currentOpacities[i];

            if (op < 0.01) continue;

            // Perspective scale
            const zScale = Math.max(0.1, (z + 2.0) / 2.0);
            const size = baseParticleSize * zScale;
            
            // Instead of changing ctx.globalAlpha per particle (which is slow),
            // we'll just draw rects and rely on additive blending or we can batch them.
            // For simplicity and speed in this demo, setting alpha via fillStyle per batch or just drawing lines
            // Actually, for maximum speed, we can just draw them all if the number isn't crazy.
            // Setting globalAlpha in a loop is expensive.
            // We can bucket them roughly into 5 alpha levels.
            
            // To keep it strictly zero allocation and fast, we'll just use moveTo/lineTo to draw tiny dots.
            // Wait, rect is faster.
            // But we need varying opacity. Let's do 5 buckets.
        }

        // 5 Alpha Buckets
        for (let bucket = 1; bucket <= 5; bucket++) {
            const alphaVal = bucket * 0.2;
            this.ctx.globalAlpha = alphaVal;
            this.ctx.beginPath();
            
            for (let i = 0; i < this.numParticles; i++) {
                const op = this.currentOpacities[i];
                // Check if this particle belongs in this bucket
                if (op > (bucket - 1) * 0.2 && op <= bucket * 0.2) {
                    const idx3 = i * 3;
                    const x = this.currentPositions[idx3] * scale + cx;
                    const y = this.currentPositions[idx3 + 1] * scale + cy;
                    const z = this.currentPositions[idx3 + 2];
                    
                    const zScale = Math.max(0.1, (z + 2.0) / 2.0);
                    const size = baseParticleSize * zScale;
                    
                    this.ctx.rect(x, y, size, size);
                }
            }
            this.ctx.fill();
        }

        // Draw connections (filaments)
        // Only draw connections for the first 300 particles to save performance
        this.ctx.globalAlpha = 0.15;
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.isDark ? "rgba(168, 85, 247, 0.8)" : "rgba(100, 116, 139, 0.5)";
        
        this.ctx.beginPath();
        const maxLines = 150;
        let linesDrawn = 0;
        
        for (let i = 0; i < this.numParticles && linesDrawn < maxLines; i++) {
            const idx3_A = i * 3;
            const xa = this.currentPositions[idx3_A] * scale + cx;
            const ya = this.currentPositions[idx3_A + 1] * scale + cy;
            const za = this.currentPositions[idx3_A + 2];
            
            // Only draw lines between particles that are currently quite visible
            if (this.currentOpacities[i] < 0.5) continue;

            for (let j = i + 1; j < this.numParticles && linesDrawn < maxLines; j++) {
                if (this.currentOpacities[j] < 0.5) continue;
                
                const idx3_B = j * 3;
                const xb = this.currentPositions[idx3_B] * scale + cx;
                const yb = this.currentPositions[idx3_B + 1] * scale + cy;
                const zb = this.currentPositions[idx3_B + 2];
                
                const distSq = (xa - xb) * (xa - xb) + (ya - yb) * (ya - yb);
                const threshold = scale * 0.15; // Connection distance threshold
                
                if (distSq < threshold * threshold) {
                    this.ctx.moveTo(xa, ya);
                    this.ctx.lineTo(xb, yb);
                    linesDrawn++;
                }
            }
        }
        this.ctx.stroke();

        this.ctx.globalAlpha = 1.0;
    }
}
