/* ================================
   VALENTINE'S DAY FINALE JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    initFirefliesAndHearts();
    initHeartGIF();
});

// Fireflies and Floating Hearts
function initFirefliesAndHearts() {
    const canvas = document.getElementById('firefliesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const entities = [];
    
    // Fireflies
    for (let i = 0; i < 40; i++) {
        entities.push({
            type: 'firefly',
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random(),
            pulseSpeed: Math.random() * 0.05 + 0.02
        });
    }
    
    // Hearts
    for (let i = 0; i < 15; i++) {
        entities.push({
            type: 'heart',
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 8 + 4,
            opacity: Math.random() * 0.5 + 0.3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        entities.forEach(entity => {
            entity.x += entity.vx;
            entity.y += entity.vy;
            
            // Wrap around
            if (entity.x < -20) entity.x = canvas.width + 20;
            if (entity.x > canvas.width + 20) entity.x = -20;
            if (entity.y < -20) entity.y = canvas.height + 20;
            if (entity.y > canvas.height + 20) entity.y = -20;
            
            if (entity.type === 'firefly') {
                // Pulse opacity
                entity.opacity += entity.pulseSpeed;
                if (entity.opacity > 1 || entity.opacity < 0) {
                    entity.pulseSpeed = -entity.pulseSpeed;
                }
                
                // Draw firefly
                ctx.globalAlpha = entity.opacity;
                ctx.fillStyle = '#ffd700';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ffd700';
                ctx.beginPath();
                ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else {
                // Draw heart
                entity.rotation += entity.rotationSpeed;
                ctx.save();
                ctx.translate(entity.x, entity.y);
                ctx.rotate(entity.rotation);
                ctx.globalAlpha = entity.opacity;
                drawHeart(ctx, 0, 0, entity.size);
                ctx.restore();
            }
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Heart GIF with Playback Control
function initHeartGIF() {
    const container = document.getElementById('heartContainer');
    const image = document.getElementById('heartImage');
    
    if (!container || !image) return;
    
    // IMPORTANT: Replace these with your actual URLs
    const STATIC_IMAGE_URL = 'heart-still.png'; // Frozen heart frame
    const GIF_URL = 'red-heart-bumping.gif'; // Beating heart GIF
    const GIF_DURATION = 2000; // Duration of GIF in milliseconds (adjust to match your GIF)
    
    let isPlaying = false;
    
    // Set initial static image
    image.src = STATIC_IMAGE_URL;
    
    function playHeartBeat() {
        if (isPlaying) return;
        
        isPlaying = true;
        
        // Play GIF by switching to GIF source with cache-busting
        image.src = GIF_URL + '?t=' + Date.now();
        
        // Add playing animation class
        container.classList.add('playing');
        
        // After GIF finishes, switch back to static image
        setTimeout(() => {
            image.src = STATIC_IMAGE_URL;
            container.classList.remove('playing');
            
            isPlaying = false;
        }, GIF_DURATION);
    }
    
    // Mouse click
    container.addEventListener('click', playHeartBeat);
    
    // Touch support
    container.addEventListener('touchend', (e) => {
        e.preventDefault();
        playHeartBeat();
    });
}

// Helper function
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