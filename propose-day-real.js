/* ================================
   PROPOSE DAY (STAGE 2 - REAL) JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    initStars();
    init3DRing();
    initAnswerButtons();
});

// Starry Night Background
function initStars() {
    const canvas = document.getElementById('starsCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const stars = [];
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            star.opacity += star.twinkleSpeed;
            if (star.opacity > 1 || star.opacity < 0) {
                star.twinkleSpeed = -star.twinkleSpeed;
            }
            
            ctx.globalAlpha = star.opacity;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    
    animate();
}

function init3DRing() {
    const container = document.getElementById('ringContainer');
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* LIGHTING */
    const light = new THREE.PointLight(0xffffff, 2); // pure white light
    light.position.set(3, 4, 5);
    scene.add(light);


    /* RING GROUP */
    const ringGroup = new THREE.Group();

    /* BAND — bigger */
    const band = new THREE.Mesh(
        new THREE.TorusGeometry(1.4, 0.18, 32, 120),
        new THREE.MeshStandardMaterial({
            color: 0xffd700,
        metalness: 0.6,
        roughness: 0.25
        })
    );
    ringGroup.add(band);

/* ===== DIAMOND — PERFECTLY ABOVE BAND ===== */

const diamond = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.45),
    new THREE.MeshStandardMaterial({
        color: 0x6ecbff,        // soft sky-blue diamond
    emissive: 0x1a4cff,     // subtle inner glow
    metalness: 0.1,         // crystal feel
    roughness: 0.02,        // very shiny
    transparent: true,
    opacity: 0.95
    })
);

/* --- calculate exact ring top --- */
const bandOuterRadius = 1.4;   // torus main radius
const bandTube = 0.18;         // torus thickness
const diamondSize = 0.45;      // octahedron radius

/* place diamond exactly touching band */
diamond.position.y = bandOuterRadius + bandTube + diamondSize * 0.6;

ringGroup.add(diamond);


    /* CENTER MODEL */
    const box = new THREE.Box3().setFromObject(ringGroup);
    const center = new THREE.Vector3();
    box.getCenter(center);
    ringGroup.position.sub(center);

    scene.add(ringGroup);

    /* CAMERA PERFECT CENTER */
    camera.position.set(0, 0.2, 5);
    camera.lookAt(0, 0, 0);

    /* DRAG CONTROLS (MOUSE + TOUCH) */
    let dragging = false;
    let prevX = 0;

    const start = x => { dragging = true; prevX = x; };
    const move = x => {
        if (!dragging) return;
        ringGroup.rotation.y += (x - prevX) * 0.01;
        prevX = x;
    };
    const end = () => dragging = false;

    container.addEventListener("mousedown", e => start(e.clientX));
    window.addEventListener("mousemove", e => move(e.clientX));
    window.addEventListener("mouseup", end);

    container.addEventListener("touchstart", e => start(e.touches[0].clientX));
    window.addEventListener("touchmove", e => move(e.touches[0].clientX));
    window.addEventListener("touchend", end);

    /* ANIMATION */
    function animate() {
        requestAnimationFrame(animate);

        if (!dragging) ringGroup.rotation.y += 0.004;

        diamond.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
    animate();

    /* RESPONSIVE */
    window.addEventListener("resize", () => {
        const w = container.clientWidth;
        const h = container.clientHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}


// Answer Buttons
function initAnswerButtons() {
    const yesBtn = document.getElementById('yesAnswer');
    const alwaysBtn = document.getElementById('alwaysAnswer');
    const overlay = document.getElementById('celebrationOverlay');
    
    if (!yesBtn || !alwaysBtn || !overlay) return;
    
    const celebrate = () => {
        // Create heart explosion
        createHeartExplosion();
        
        setTimeout(() => {
            overlay.classList.add('active');
        }, 1000);
    };
    
    yesBtn.addEventListener('click', celebrate);
    alwaysBtn.addEventListener('click', () => {
        // Bigger celebration for "Always Yes"
        createHeartExplosion(true);
        
        setTimeout(() => {
            overlay.classList.add('active');
        }, 1500);
    });
}

// Heart Explosion Effect
function createHeartExplosion(bigger = false) {
    const count = bigger ? 50 : 30;
    const container = document.body;
    
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            font-size: ${bigger ? '3rem' : '2rem'};
            pointer-events: none;
            z-index: 9998;
            animation: heartExplode ${1 + Math.random()}s ease-out forwards;
        `;
        
        const angle = (Math.PI * 2 / count) * i;
        const distance = bigger ? 300 : 200;
        heart.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        heart.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
        
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 2000);
    }
    
    // Add CSS animation if not exists
    if (!document.getElementById('heartExplodeStyle')) {
        const style = document.createElement('style');
        style.id = 'heartExplodeStyle';
        style.textContent = `
            @keyframes heartExplode {
                to {
                    transform: translate(var(--tx), var(--ty)) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}