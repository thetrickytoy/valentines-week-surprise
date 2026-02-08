/* ================================
   PROPOSE DAY (STAGE 1) JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    initFloatingIcons();
    initYesButton();
});

// Floating Momos and Ice Cream
function initFloatingIcons() {
    const canvas = document.getElementById('floatingCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const icons = ['🥟', '🍦'];
    const particles = [];
    
    for (let i = 0; i < 15; i++) {
        particles.push({
            emoji: icons[Math.floor(Math.random() * icons.length)],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vy: Math.random() * 0.5 + 0.2,
            vx: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 20 + 30,
            opacity: Math.random() * 0.5 + 0.3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.y += particle.vy;
            particle.x += particle.vx;
            particle.rotation += particle.rotationSpeed;
            
            if (particle.y > canvas.height + 50) {
                particle.y = -50;
                particle.x = Math.random() * canvas.width;
            }
            
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.globalAlpha = particle.opacity;
            ctx.font = `${particle.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(particle.emoji, 0, 0);
            ctx.restore();
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Yes Button Handler
function initYesButton() {
    const yesBtn = document.getElementById('yesBtn');
    if (!yesBtn) return;
    
    yesBtn.addEventListener('click', () => {
        // Create magic transition effect
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,105,180,0.8), rgba(0,0,0,0.95));
            z-index: 9999;
            opacity: 0;
            transition: opacity 1s ease;
        `;
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            window.location.href = 'propose-day-real.html';
        }, 1500);
    });
}