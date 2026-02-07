/* ================================
MAIN JAVASCRIPT - SHARED UTILITIES
================================ */// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
initPreloader();
initMusicToggle();
initPageTransitions();
});// Preloader
function initPreloader() {
const preloader = document.getElementById('preloader');
const mainContent = document.getElementById('mainContent') || document.querySelector('.main-content');if (preloader) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            if (mainContent) {
                mainContent.classList.add('visible');
            }
        }, 1500);
    });
} else if (mainContent) {
    // If no preloader, show content immediately
    mainContent.classList.add('visible');
}
}// Music Toggle
function initMusicToggle() {
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');if (musicToggle && bgMusic) {
    let isPlaying = false;    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        } else {
            bgMusic.play();
            musicToggle.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}
}// Page Transitions
function initPageTransitions() {
const links = document.querySelectorAll('a[href$=".html"]');links.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');        // Don't prevent default for external links
        if (href && !href.startsWith('http')) {
            e.preventDefault();            // Fade out
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '0';            // Navigate after fade
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        }
    });
});
}// Utility: Create particle
function createParticle(canvas, ctx, config) {
return {
x: Math.random() * canvas.width,
y: Math.random() * canvas.height,
vx: (Math.random() - 0.5) * (config.speedX || 1),
vy: (Math.random() - 0.5) * (config.speedY || 1),
size: Math.random() * (config.maxSize || 3) + (config.minSize || 1),
opacity: Math.random() * 0.5 + 0.3,
color: config.color || 'rgba(255, 255, 255, 0.8)'
};
}// Utility: Animate particles
function animateParticles(canvas, ctx, particles, config = {}) {
ctx.clearRect(0, 0, canvas.width, canvas.height);particles.forEach((particle, index) => {
    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;    // Wrap around edges
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;    // Draw particle
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
});ctx.globalAlpha = 1;
requestAnimationFrame(() => animateParticles(canvas, ctx, particles, config));
}// Utility: Resize canvas
function resizeCanvas(canvas) {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}