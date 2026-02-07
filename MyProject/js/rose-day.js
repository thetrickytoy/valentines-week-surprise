document.addEventListener("DOMContentLoaded", () => {
    initPetals();
    initRose();
});

/* ================= PETALS ================= */
function initPetals() {
    const canvas = document.getElementById("petalsCanvas");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const petals = Array.from({ length: 35 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.4 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 0.6,
        size: 8 + Math.random() * 10,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.5 + Math.random() * 0.5
    }));

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.opacity;

        ctx.fillStyle = "#ff4d6d";
        ctx.beginPath();

        /* heart-like petal shape */
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size, -p.size, -p.size * 1.2, p.size, 0, p.size * 1.4);
        ctx.bezierCurveTo(p.size * 1.2, p.size, p.size, -p.size, 0, 0);

        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        petals.forEach(p => {
            p.y += p.speed;
            p.x += p.drift;
            p.rot += p.rotSpeed;

            if (p.y > canvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }

            drawPetal(p);
        });

        requestAnimationFrame(animate);
    }

    animate();
}


/* ================= 3D ROSE ================= */
function initRose() {
    const container = document.getElementById("roseContainer");

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );
    camera.position.set(0, -0.3, 4.5);
    camera.lookAt(0, -0.2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    /* Lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const pinkLight = new THREE.PointLight(0xff4d6d, 1.4);
    pinkLight.position.set(2, 3, 3);
    scene.add(pinkLight);

    /* Rose group */
    const roseGroup = new THREE.Group();

    /* ---------- PETAL MATERIAL ---------- */
    const petalMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4143c,
        roughness: 0.45,
        metalness: 0.05,
        emissive: 0x330000,
        side: THREE.DoubleSide
    });

    /* Petal geometry */
    const petalPoints = [];
    for (let i = 0; i <= 10; i++) {
        const x = Math.sin((i / 10) * Math.PI) * 0.35;
        const y = (i - 5) * 0.12;
        petalPoints.push(new THREE.Vector2(x, y));
    }

    const petalGeo = new THREE.LatheGeometry(petalPoints, 24);

    const layers = 5;
    const petalsPerLayer = 10;

    for (let l = 0; l < layers; l++) {
        for (let i = 0; i < petalsPerLayer; i++) {
            const petal = new THREE.Mesh(petalGeo, petalMaterial);

            const angle = (i / petalsPerLayer) * Math.PI * 2 + l * 0.5;
            const radius = 0.15 + l * 0.18;

            petal.position.set(
                Math.cos(angle) * radius,
                l * 0.18,
                Math.sin(angle) * radius
            );

            petal.rotation.y = angle;
            petal.rotation.x = -0.4;

            const scale = 0.9 - l * 0.08;
            petal.scale.set(scale, scale, scale);

            roseGroup.add(petal);
        }
    }

    /* Center bud */
    const budGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const bud = new THREE.Mesh(budGeo, petalMaterial);
    bud.position.y = 0.15;
    roseGroup.add(bud);

    /* ---------- SHORTER STEM ---------- */
    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.06, 2.1, 16), // shorter height
        new THREE.MeshStandardMaterial({ color: 0x1f7a3a })
    );

    stem.position.set(0, -1.25, 0); // adjusted to sit naturally
    roseGroup.add(stem);

    /* CENTER MODEL */
    const box = new THREE.Box3().setFromObject(roseGroup);
    const center = new THREE.Vector3();
    box.getCenter(center);
    roseGroup.position.sub(center);
    roseGroup.position.y -= 0.4;

    scene.add(roseGroup);

    /* DRAG ROTATION */
    let dragging = false;
    let prevX = 0;

    container.addEventListener("mousedown", e => {
        dragging = true;
        prevX = e.clientX;
    });

    window.addEventListener("mouseup", () => dragging = false);

    window.addEventListener("mousemove", e => {
        if (!dragging) return;
        roseGroup.rotation.y += (e.clientX - prevX) * 0.01;
        prevX = e.clientX;
    });

    /* Gentle idle rotation */
    function animate() {
        requestAnimationFrame(animate);

        if (!dragging) {
            roseGroup.rotation.y += 0.002;
        }

        renderer.render(scene, camera);
    }

    animate();
}
