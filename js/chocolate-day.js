/* ================================
   CHOCOLATE DAY JAVASCRIPT
   ================================ */

document.addEventListener('DOMContentLoaded', () => {
    initChocolateDrip();
    initFallingTreats();
    init3DChocolateBar();
});

// Chocolate Dripping Animation
function initChocolateDrip() {
    const canvas = document.getElementById('chocolateCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const drips = [];
    
    // Create drips periodically
    setInterval(() => {
        if (drips.length < 10) {
            drips.push({
                x: Math.random() * canvas.width,
                y: 0,
                vy: Math.random() * 2 + 1,
                length: Math.random() * 50 + 30,
                width: Math.random() * 8 + 4
            });
        }
    }, 500);
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drips.forEach((drip, index) => {
            drip.y += drip.vy;
            
            // Remove if off screen
            if (drip.y > canvas.height + drip.length) {
                drips.splice(index, 1);
                return;
            }
            
            // Draw drip
            const gradient = ctx.createLinearGradient(0, drip.y - drip.length, 0, drip.y);
            gradient.addColorStop(0, 'rgba(139, 69, 19, 0)');
            gradient.addColorStop(0.5, 'rgba(139, 69, 19, 0.8)');
            gradient.addColorStop(1, 'rgba(101, 67, 33, 1)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(drip.x - drip.width / 2, drip.y - drip.length, drip.width, drip.length);
            
            // Drip end (rounded)
            ctx.fillStyle = 'rgba(101, 67, 33, 1)';
            ctx.beginPath();
            ctx.arc(drip.x, drip.y, drip.width / 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Falling Chocolates and Candies
function initFallingTreats() {
    const canvas = document.getElementById('fallingCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    const treats = ['🍫', '🍬', '🍭', '🍩', '🧁', '🍰'];
    const fallingTreats = [];
    const treatCount = 25;
    
    // Initialize falling treats
    for (let i = 0; i < treatCount; i++) {
        fallingTreats.push({
            emoji: treats[Math.floor(Math.random() * treats.length)],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vy: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 20 + 25,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.03,
            opacity: Math.random() * 0.4 + 0.4
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        fallingTreats.forEach(treat => {
            treat.y += treat.vy;
            treat.x += treat.vx;
            treat.rotation += treat.rotationSpeed;
            
            // Add slight swing motion
            treat.x += Math.sin(treat.y * 0.01) * 0.3;
            
            // Reset when off screen
            if (treat.y > canvas.height + 50) {
                treat.y = -50;
                treat.x = Math.random() * canvas.width;
                treat.emoji = treats[Math.floor(Math.random() * treats.length)];
            }
            
            // Wrap horizontally
            if (treat.x < -50) treat.x = canvas.width + 50;
            if (treat.x > canvas.width + 50) treat.x = -50;
            
            ctx.save();
            ctx.translate(treat.x, treat.y);
            ctx.rotate(treat.rotation);
            ctx.globalAlpha = treat.opacity;
            ctx.font = `${treat.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(treat.emoji, 0, 0);
            ctx.restore();
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ================================
// REALISTIC 3D CHOCOLATE (ROTATE ONLY)
// ================================
function init3DChocolateBar() {
    const container = document.getElementById('chocolateBarContainer');
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.domElement.style.display = "block";
    renderer.domElement.style.margin = "0 auto";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.position = "relative";   // ⭐ restores centering


    container.appendChild(renderer.domElement);

    /* ===== LIGHTING ===== */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const keyLight = new THREE.PointLight(0xffe6c7, 1.4);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xffffff, 0.5);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    /* ===== CHOCOLATE GROUP ===== */
    const chocolateGroup = new THREE.Group();

    // Realistic glossy chocolate material
    const chocolateMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a2511,
        roughness: 0.35,   // lower = shinier
        metalness: 0.15,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25
    });

    const pieceGeo = new THREE.BoxGeometry(0.9, 0.35, 0.9);

    const grid = 3;

    for (let x = 0; x < grid; x++) {
        for (let z = 0; z < grid; z++) {
            const piece = new THREE.Mesh(pieceGeo, chocolateMaterial.clone());

            piece.position.set(
                (x - 1) * 1,
                0,
                (z - 1) * 1
            );

            chocolateGroup.add(piece);
        }
    }

    scene.add(chocolateGroup);

    /* ===== CAMERA ===== */
    camera.position.set(0, 2.2, 4.5);
    camera.lookAt(0, 0, 0);

       /* DRAG CONTROLS (MOUSE + TOUCH) */
    let dragging = false;
    let prevX = 0;

    const start = x => { dragging = true; prevX = x; };
    const move = x => {
        if (!dragging) return;
        chocolateGroup.rotation.y += (x - prevX) * 0.01;
        prevX = x;
    };
    const end = () => dragging = false;

    container.addEventListener("mousedown", e => start(e.clientX));
    window.addEventListener("mousemove", e => move(e.clientX));
    window.addEventListener("mouseup", end);

    container.addEventListener("touchstart", e => start(e.touches[0].clientX));
    window.addEventListener("touchmove", e => move(e.touches[0].clientX));
    window.addEventListener("touchend", end);

    /* ===== FLOAT + AUTO ROTATE ===== */
    function animate() {
        requestAnimationFrame(animate);

        if (!dragging) {
            chocolateGroup.rotation.y += 0.002;
        }

        chocolateGroup.position.y = Math.sin(Date.now() * 0.002) * 0.08;

        renderer.render(scene, camera);
    }

    animate();

    /* ===== RESPONSIVE ===== */
    window.addEventListener("resize", () => {
        const w = container.clientWidth;
        const h = container.clientHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}
