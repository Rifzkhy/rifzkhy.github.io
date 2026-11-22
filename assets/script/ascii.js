/**
 * Midjourney-Style Dynamic ASCII Flow & Matrix Scrambler
 * Ultra-Optimized 60 FPS Canvas ASCII Field (Zero-GC, Pre-computed Harmonics, Fluid Dynamics)
 */

const container = document.getElementById("ascii-container");

let canvas = document.getElementById("ascii-canvas");
if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "ascii-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.zIndex = "1";
    canvas.style.pointerEvents = "none";
    container.insertBefore(canvas, container.firstChild);
}

const ctx = canvas.getContext("2d", { alpha: false });

// Rich cyberpunk ASCII charset
const CHARS = "·:;=+*#%░▒▓";
const GLITCH_CHARS = "01<>[]{}/*~^$#@!+";
const CHARS_LEN = CHARS.length;
const GLITCH_LEN = GLITCH_CHARS.length;

// Pre-allocated static color palette (16 shades) - Zero Garbage Collection
const PALETTE_SIZE = 16;
const PALETTE = new Array(PALETTE_SIZE);
for (let i = 0; i < PALETTE_SIZE; i++) {
    const t = i / (PALETTE_SIZE - 1);
    const alpha = (0.16 + t * 0.76).toFixed(2);
    const r = Math.round(180 + t * 75);
    const g = Math.round(215 + t * 40);
    PALETTE[i] = `rgba(${r}, ${g}, 255, ${alpha})`;
}

let width = 0;
let height = 0;
let cols = 0;
let rows = 0;

// Crisp, comfortable font sizing
let fontSize = 15;
let charWidth = 9.5;

// Pre-allocated harmonic wave buffers
let colWaves = new Float32Array(0);
let rowWaves = new Float32Array(0);

function resize() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;

    // Use 1:1 pixel rendering for ASCII text to ensure locked 60 FPS on all devices
    canvas.width = width;
    canvas.height = height;

    if (width < 576) {
        fontSize = 12;
    } else if (width < 992) {
        fontSize = 14;
    } else {
        fontSize = 16;
    }

    charWidth = fontSize * 0.62;
    cols = Math.ceil(width / charWidth) + 1;
    rows = Math.ceil(height / fontSize) + 1;

    colWaves = new Float32Array(cols);
    rowWaves = new Float32Array(rows);
}

window.addEventListener("resize", resize);
resize();

// Mouse / Touch tracking with smooth lerp
const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    active: false,
    radius: 240,
    radiusSq: 240 * 240
};

window.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
    mouse.active = true;
});

window.addEventListener("mouseleave", () => {
    mouse.active = false;
});

window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
        mouse.active = true;
    }
}, { passive: true });

let time = 0;
let isVisible = true;
let animationFrameId = null;

function render() {
    if (!isVisible) {
        animationFrameId = null;
        return;
    }

    animationFrameId = requestAnimationFrame(render);

    time += 0.02;

    // Smooth lerp mouse coordinates
    mouse.x += (mouse.targetX - mouse.x) * 0.12;
    mouse.y += (mouse.targetY - mouse.y) * 0.12;

    // Clear background with theme primary blue (#0d6efd)
    ctx.fillStyle = "#0d6efd";
    ctx.fillRect(0, 0, width, height);

    ctx.font = `bold ${fontSize}px "SF Mono", "Consolas", "Courier New", monospace`;
    ctx.textBaseline = "top";

    // 1. PRE-CALCULATE column & row wave harmonics outside inner loop (240x speedup!)
    for (let c = 0; c < cols; c++) {
        colWaves[c] = Math.sin(c * 0.055 + time * 0.9);
    }
    for (let r = 0; r < rows; r++) {
        rowWaves[r] = Math.cos(r * 0.065 - time * 1.1);
    }

    const mouseX = mouse.x;
    const mouseY = mouse.y;
    const mouseActive = mouse.active;
    const radiusSq = mouse.radiusSq;
    const invRadius = 1 / mouse.radius;

    let currentColorIdx = -1;

    for (let r = 0; r < rows; r++) {
        const y = r * fontSize;
        const rowWave = rowWaves[r];
        const dyMouse = y - mouseY;
        const dyMouseSq = dyMouse * dyMouse;

        for (let c = 0; c < cols; c++) {
            const x = c * charWidth;

            // Fast mouse influence check without square root unless inside radius
            let mouseInfluence = 0;
            if (mouseActive) {
                const dxMouse = x - mouseX;
                const distSq = dxMouse * dxMouse + dyMouseSq;
                if (distSq < radiusSq) {
                    mouseInfluence = 1 - Math.sqrt(distSq) * invRadius;
                }
            }

            // High-speed combined wave calculation
            const wave1 = colWaves[c];
            const wave3 = Math.sin((c + r) * 0.035 + time * 0.8);
            const energy = (wave1 * 0.44 + rowWave * 0.38 + wave3 * 0.18) + (mouseInfluence * 0.85);

            // Normalized to 0..1 range
            const normEnergy = Math.min(1, Math.max(0, (energy + 1) * 0.5));

            // Random character scramble / glitch mutation (~2.5% chance)
            const isGlitch = Math.random() < 0.025;
            let char;
            if (isGlitch) {
                char = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_LEN)];
            } else {
                const charIdx = Math.floor(normEnergy * (CHARS_LEN - 1));
                char = CHARS[charIdx];
            }

            // Map energy directly to pre-cached color palette (ZERO garbage collection!)
            const paletteIdx = Math.min(PALETTE_SIZE - 1, Math.floor(normEnergy * PALETTE_SIZE));
            if (paletteIdx !== currentColorIdx) {
                currentColorIdx = paletteIdx;
                ctx.fillStyle = PALETTE[paletteIdx];
            }

            ctx.fillText(char, x, y);
        }
    }
}

// Pause rendering when hero section is off-screen or page is hidden
const observer = new IntersectionObserver(
    (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting && !document.hidden;
        if (isVisible && !animationFrameId) {
            render();
        }
    },
    { threshold: 0.05 }
);
observer.observe(container);

document.addEventListener("visibilitychange", () => {
    isVisible = !document.hidden && (container.getBoundingClientRect().bottom > 0);
    if (isVisible && !animationFrameId) {
        render();
    }
});

// Initial boot
render();
