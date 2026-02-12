/* ================================
   KISS DAY JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initRainingKissEmojis();
    initKissInteraction();
});

// Floating Particles
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
            color: 'rgba(255, 105, 180, 0.5)'
        }));
    }
    
    animateParticles(canvas, ctx, particles);
}

// Raining Kiss Emojis
function initRainingKissEmojis() {
    const canvas = document.getElementById('rainingCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const emojis = ['😘', '💋', '💖', '🥰', '💞', '😘', '💋', '💖'];
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

// Kiss Interaction - 5 Tap Counter with GIF Control
function initKissInteraction() {
    const container = document.getElementById('kissContainer');
    const image = document.getElementById('kissImage');
    const tapCounter = document.getElementById('tapCounter');
    
    if (!container || !image || !tapCounter) return;
    
    // IMPORTANT: Replace these with your actual URLs
    const STATIC_IMAGE_URL = 'kiss-still.png'; // Static/frozen frame
    const GIF_URL = 'kiss.gif'; // Animated GIF
    const GIF_DURATION = 2000; // Duration of GIF in milliseconds (adjust to match your GIF)
    
    let tapCount = 0;
    const maxTaps = 5;
    let isPlaying = false;
    
    // Set initial static image
    image.src = STATIC_IMAGE_URL;
    
    function handleTap() {
        if (isPlaying) return;
        
        isPlaying = true;
        
        // Increment tap count
        tapCount++;
        
        // Update counter display
        const remaining = maxTaps - tapCount;
        tapCounter.textContent = remaining > 0 ? remaining : '5';
        
        // Play GIF by switching to GIF source with cache-busting
        image.src = GIF_URL + '?t=' + Date.now();
        
        // Add playing animation class
        container.classList.add('playing');
        
        // After GIF finishes, switch back to static image
        setTimeout(() => {
            image.src = STATIC_IMAGE_URL;
            container.classList.remove('playing');
            
            // Restore floating animation
            container.style.animation = 'floatKiss 3s ease-in-out infinite';
            
            isPlaying = false;
        }, GIF_DURATION);
        
        // Check if reached 5 taps
        if (tapCount >= maxTaps) {
            setTimeout(() => {
                createKissBurst();
                tapCount = 0; // Reset counter
                tapCounter.textContent = '5';
            }, GIF_DURATION / 2);
        }
    }
    
    function createKissBurst() {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const emojis = ['💋', '💖', '💋', '💖', '💋', '💖'];
        const burstCount = 40;
        
        for (let i = 0; i < burstCount; i++) {
            const emoji = document.createElement('div');
            const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.innerHTML = selectedEmoji;
            emoji.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: ${Math.random() * 1.5 + 1.5}rem;
                pointer-events: none;
                z-index: 9998;
                animation: kissBurst ${1 + Math.random() * 0.5}s ease-out forwards;
            `;
            
            const angle = (Math.PI * 2 / burstCount) * i;
            const distance = 200 + Math.random() * 100;
            emoji.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            emoji.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 1500);
        }
    }
    
    // Mouse click
    container.addEventListener('click', handleTap);
    
    // Touch support
    container.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleTap();
    });
    
    // Add CSS animation if not exists
    if (!document.getElementById('kissBurstStyle')) {
        const style = document.createElement('style');
        style.id = 'kissBurstStyle';
        style.textContent = `
            @keyframes kissBurst {
                0% {
                    transform: translate(0, 0) scale(1) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}