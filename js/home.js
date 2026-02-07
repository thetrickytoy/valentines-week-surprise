/* ================================
HOME PAGE JAVASCRIPT
================================ */document.addEventListener('DOMContentLoaded', () => {
initParticles();
initLilyFlowers();
});// Floating Hearts Particles
function initParticles() {
const canvas = document.getElementById('particleCanvas');
if (!canvas) return;const ctx = canvas.getContext('2d');
resizeCanvas(canvas);window.addEventListener('resize', () => resizeCanvas(canvas));const particles = [];
const particleCount = 30;for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle(canvas, ctx, {
        speedX: 0.3,
        speedY: 0.5,
        maxSize: 4,
        minSize: 2,
        color: 'rgba(255, 105, 180, 0.6)'
    }));
}function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);    particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;        // Draw heart shape
        ctx.globalAlpha = particle.opacity;
        drawHeart(ctx, particle.x, particle.y, particle.size);
    });    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
}animate();
}// Raining Lily-of-the-Valley Flowers
function initLilyFlowers() {
const canvas = document.getElementById('lilyCanvas');
if (!canvas) return;const ctx = canvas.getContext('2d');
resizeCanvas(canvas);window.addEventListener('resize', () => resizeCanvas(canvas));const flowers = [];
const flowerCount = 20;for (let i = 0; i < flowerCount; i++) {
    flowers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vy: Math.random() * 2 + 1,
        vx: Math.random() * 0.5 - 0.25,
        size: Math.random() * 15 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.5 + 0.3
    });
}function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);    flowers.forEach(flower => {
        flower.y += flower.vy;
        flower.x += flower.vx;
        flower.rotation += flower.rotationSpeed;        if (flower.y > canvas.height + 50) {
            flower.y = -50;
            flower.x = Math.random() * canvas.width;
        }        ctx.save();
        ctx.translate(flower.x, flower.y);
        ctx.rotate(flower.rotation);
        ctx.globalAlpha = flower.opacity;        // Draw lily flower (simple representation)
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';        // Petals
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((Math.PI * 2 / 5) * i);
            ctx.beginPath();
            ctx.ellipse(0, -flower.size * 0.4, flower.size * 0.3, flower.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }        // Center
        ctx.fillStyle = '#ffffcc';
        ctx.beginPath();
        ctx.arc(0, 0, flower.size * 0.2, 0, Math.PI * 2);
        ctx.fill();        ctx.restore();
    });    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
}animate();
}// Helper function to draw heart
function drawHeart(ctx, x, y, size) {
ctx.fillStyle = 'rgba(255, 105, 180, 0.6)';
ctx.beginPath();
ctx.moveTo(x, y + size / 4);
ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x - size / 2, y + size / 4);
ctx.bezierCurveTo(x - size / 2, y + size, x, y + size * 1.3, x, y + size * 1.5);
ctx.bezierCurveTo(x, y + size * 1.3, x + size / 2, y + size, x + size / 2, y + size / 4);
ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
ctx.fill();
}