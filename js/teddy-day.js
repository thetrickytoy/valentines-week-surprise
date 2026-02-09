/* ================================
   TEDDY DAY JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initRainingHeartsAndTeddies();
});

// Warm Floating Particles
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(canvas, ctx, {
            speedX: 0.2,
            speedY: 0.3,
            maxSize: 3,
            minSize: 1,
            color: 'rgba(222, 184, 135, 0.5)'
        }));
    }
    
    animateParticles(canvas, ctx, particles);
}

// Raining Hearts and Teddy Bears
function initRainingHeartsAndTeddies() {
    const canvas = document.getElementById('rainingCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const emojis = ['💕', '💗', '💖', '💝', '🧸', '🧸', '💕', '💗'];
    const rainingItems = [];
    const itemCount = 20;
    
    // Initialize raining items
    for (let i = 0; i < itemCount; i++) {
        rainingItems.push({
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vy: Math.random() * 1.5 + 0.8,
            vx: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 20 + 25,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.03,
            opacity: Math.random() * 0.4 + 0.5
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        rainingItems.forEach(item => {
            item.y += item.vy;
            item.x += item.vx;
            item.rotation += item.rotationSpeed;
            
            // Add slight swing motion
            item.x += Math.sin(item.y * 0.01) * 0.3;
            
            // Reset when off screen
            if (item.y > canvas.height + 50) {
                item.y = -50;
                item.x = Math.random() * canvas.width;
                item.emoji = emojis[Math.floor(Math.random() * emojis.length)];
            }
            
            // Wrap horizontally
            if (item.x < -50) item.x = canvas.width + 50;
            if (item.x > canvas.width + 50) item.x = -50;
            
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rotation);
            ctx.globalAlpha = item.opacity;
            ctx.font = `${item.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.emoji, 0, 0);
            ctx.restore();
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    
    animate();
}

document.addEventListener("DOMContentLoaded", () => {
    const teddy = document.querySelector(".teddy");
    if (!teddy) return;

    teddy.addEventListener("click", () => {
        teddy.classList.toggle("happy");
    });

    teddy.addEventListener("touchstart", () => {
        teddy.classList.toggle("happy");
    });
});

