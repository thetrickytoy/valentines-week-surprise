/* ================================
   PROMISE DAY JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initRainingEmojis();
    initPinkyPromise();
});

// Peaceful Particles
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const particles = [];
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(canvas, ctx, {
            speedX: 0.2,
            speedY: 0.2,
            maxSize: 2,
            minSize: 0.5,
            color: 'rgba(147, 112, 219, 0.5)'
        }));
    }
    
    animateParticles(canvas, ctx, particles);
}

// Raining Promise Emojis
function initRainingEmojis() {
    const canvas = document.getElementById('rainingCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const emojis = ['✨', '💫', '🤝', '💞', '💕', '✨', '💫', '💞'];
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

// Pinky Promise Interaction - Heart Burst
function initPinkyPromise() {
    const container = document.getElementById('pinkyPromiseContainer');
    
    if (!container) return;
    
    let canBurst = true;
    
    function createHeartBurst() {
        if (!canBurst) return;
        
        canBurst = false;
        
        // Get container position
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create heart burst
        const heartCount = 35;
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: ${Math.random() * 1.5 + 1.5}rem;
                pointer-events: none;
                z-index: 9998;
                animation: heartBurst ${1 + Math.random() * 0.5}s ease-out forwards;
            `;
            
            const angle = (Math.PI * 2 / heartCount) * i;
            const distance = 200 + Math.random() * 100;
            heart.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            heart.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 1500);
        }
        
        // Allow next burst after delay
        setTimeout(() => {
            canBurst = true;
        }, 1000);
    }
    
    // Mouse click
    container.addEventListener('click', createHeartBurst);
    
    // Touch support
    container.addEventListener('touchend', (e) => {
        e.preventDefault();
        createHeartBurst();
    });
    
    // Add CSS animation if not exists
    if (!document.getElementById('heartBurstStyle')) {
        const style = document.createElement('style');
        style.id = 'heartBurstStyle';
        style.textContent = `
            @keyframes heartBurst {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--tx), var(--ty)) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}