/* ================================
   SECRET LOVE LETTER JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    initEnvelopeGIF();
    initTypewriterEffect();
});

// Envelope GIF with Playback Control
function initEnvelopeGIF() {
    const container = document.getElementById('envelopeContainer');
    const image = document.getElementById('envelopeImage');
    
    if (!container || !image) return;
    
    // IMPORTANT: Replace these with your actual URLs
    const STATIC_IMAGE_URL = 'letter-still.png'; // Closed envelope frame
    const GIF_URL = 'letter.gif'; // Opening envelope GIF
    const GIF_DURATION = 3000; // Duration of GIF in milliseconds (adjust to match your GIF)
    
    let isOpening = false;
    
    // Set initial static image
    image.src = STATIC_IMAGE_URL;
    
    function openEnvelope() {
        if (isOpening) return;
        
        isOpening = true;
        
        // Play GIF by switching to GIF source with cache-busting
        image.src = GIF_URL + '?t=' + Date.now();
        
        // Add opening animation class
        container.classList.add('opening');
        
        // After GIF finishes, switch back to static image
        setTimeout(() => {
            image.src = STATIC_IMAGE_URL;
            container.classList.remove('opening');
            
            // Restore floating animation
            container.style.animation = 'floatEnvelope 3s ease-in-out infinite';
            
            isOpening = false;
        }, GIF_DURATION);
    }
    
    // Mouse click
    container.addEventListener('click', openEnvelope);
    
    // Touch support
    container.addEventListener('touchend', (e) => {
        e.preventDefault();
        openEnvelope();
    });
}

// Typewriter Effect for Letter
function initTypewriterEffect() {
    const letterBody = document.getElementById('letterContent');
    if (!letterBody) return;
    
    const paragraphs = letterBody.querySelectorAll('p');
    
    paragraphs.forEach((p, index) => {
        const text = p.textContent;
        p.textContent = '';
        p.style.opacity = '1';
        
        let charIndex = 0;
        const delay = index * 3000; // 3 seconds between paragraphs
        
        setTimeout(() => {
            const interval = setInterval(() => {
                if (charIndex < text.length) {
                    p.textContent += text.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 30); // 30ms per character
        }, delay);
    });
}