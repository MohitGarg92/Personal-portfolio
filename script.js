const elements = document.querySelectorAll(".fade");

window.addEventListener("scroll", () => {
    elements.forEach(el => {
        const position = el.getBoundingClientRect().top;

        if (position < window.innerHeight - 100) {
            el.classList.add("show");
        }
    });
});

// Typewriter effect compatible with any font family
document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".hero h1");
    if (title) {
        const text = title.textContent;

        // Measure exact width with font applied to avoid shifting
        title.style.display = "inline-block";
        title.style.width = "max-content";

        // Use a small timeout to let custom fonts load before measuring
        setTimeout(() => {
            const width = title.offsetWidth;

            // Lock the width and setup typing state
            title.style.width = width + "px";
            title.style.textAlign = "left";
            title.style.margin = "0 auto";
            title.style.whiteSpace = "nowrap";
            title.style.borderRight = "0.05em solid #ce442c";
            title.style.animation = "blink-caret 0.75s step-end infinite";

            title.textContent = "";

            let i = 0;
            // Delay typing to sync with loader
            setTimeout(() => {
                function type() {
                    if (i < text.length) {
                        title.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, 150); // Typing speed
                    }
                }
                type();
            }, 500); // starts 0.5s after fonts load & loader finishes
        }, 1000); // 1s delay waits for loader to mostly finish before measuring width
    }
});

// Interactive Parallax Canvas Background
const canvas = document.createElement("canvas");
canvas.id = "bg-canvas";
document.body.insertBefore(canvas, document.body.firstChild);

const ctx = canvas.getContext("2d");
let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const particles = [];
const numParticles = 80;

for (let i = 0; i < numParticles; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * (height * 3), // Distribute over a larger scroll area
        size: Math.random() * 2 + 1,
        // Using theme colors #00ff9d (cyan) and #ce442c (red/orange)
        color: Math.random() > 0.5 ? '#00ff9d' : '#ce442c',
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        baseY: Math.random() * (height * 3)
    });
}

let scrollY = window.scrollY;
let targetScrollY = scrollY;
let mouse = { x: -1000, y: -1000 };

window.addEventListener("scroll", () => {
    targetScrollY = window.scrollY;
});

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

function draw() {
    // Smooth scroll interpolation
    scrollY += (targetScrollY - scrollY) * 0.1;

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Apply parallax based on scroll (depth depends on size)
        let parallaxY = p.y - (scrollY * (p.size * 0.3));

        // Loop particles that go out of bounds smoothly
        let totalH = height * 3;
        parallaxY = ((parallaxY % totalH) + totalH) % totalH;

        // Mouse interaction - push particles away
        let dx = mouse.x - p.x;
        let dy = mouse.y - parallaxY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
            p.x -= dx * 0.02;
            p.y -= dy * 0.02;
        }

        ctx.beginPath();
        ctx.arc(p.x, parallaxY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Draw connections between nearby particles
        for (let j = index + 1; j < numParticles; j++) {
            let p2 = particles[j];
            let p2ParallaxY = p2.y - (scrollY * (p2.size * 0.3));
            p2ParallaxY = ((p2ParallaxY % totalH) + totalH) % totalH;

            let ddx = p.x - p2.x;
            let ddy = parallaxY - p2ParallaxY;
            let ddist = Math.sqrt(ddx * ddx + ddy * ddy);

            if (ddist < 100) {
                ctx.beginPath();
                ctx.moveTo(p.x, parallaxY);
                ctx.lineTo(p2.x, p2ParallaxY);
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = (1 - ddist / 100) * 0.15;
                ctx.stroke();
            }
        }
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
}
draw();