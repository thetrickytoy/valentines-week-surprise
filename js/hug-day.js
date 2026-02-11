/* ================================
   HUG DAY JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    initDustParticles();
    initRainingHugEmojis();
    initHugInteraction();
});

// Floating Dust Particles
function initDustParticles() {
    const canvas = document.getElementById('dustCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const particles = [];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(canvas, ctx, {
            speedX: 0.1,
            speedY: 0.15,
            maxSize: 2,
            minSize: 0.5,
            color: 'rgba(244, 164, 96, 0.4)'
        }));
    }
    
    animateParticles(canvas, ctx, particles);
}

// Raining Hug Emojis
function initRainingHugEmojis() {
    const canvas = document.getElementById('rainingCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const emojis = ['🤗', '🫂', '🥰', '❤️', '🫶', '💞', '🤗', '🫂', '🥰'];
    const rainingItems = [];
    const itemCount = 25;
    
    // Initialize raining items
    for (let i = 0; i < itemCount; i++) {
        rainingItems.push({
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vy: Math.random() * 1.5 + 0.6,
            vx: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 20 + 25,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.03,
            opacity: Math.random() * 0.4 + 0.4
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

// Hug Interaction - Zoom/Enlarge Effect
function initHugInteraction() {
    const container = document.getElementById('hugImageContainer');
    
    if (!container) return;
    
    let isHugging = false;
    
    function startHug() {
        if (isHugging) return;
        
        isHugging = true;
        container.classList.add('hugging');
        
        // Stop floating animation temporarily
        container.style.animation = 'none';
        
        // Release hug after 1.5 seconds
        setTimeout(() => {
            container.classList.remove('hugging');
            // Restore floating animation
            container.style.animation = 'floatHug 3s ease-in-out infinite';
            isHugging = false;
        }, 1500);
    }
    
    // Mouse click
    container.addEventListener('click', startHug);
    
    // Touch support
    container.addEventListener('touchend', (e) => {
        e.preventDefault();
        startHug();
    });
}