// ヒーローキャンバスアニメーション
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ドットグリッドアニメーション
const dots = [];
const dotSpacing = 50;
const dotSize = 1;
const mouseRadius = 150;
let mouseX = 0;
let mouseY = 0;

// ドットの初期化
function initDots() {
    dots.length = 0;
    for (let x = 0; x < canvas.width; x += dotSpacing) {
        for (let y = 0; y < canvas.height; y += dotSpacing) {
            dots.push({
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                offset: Math.random() * Math.PI * 2 // 修正箇所
            });
        }
    }
}

initDots();

// マウス位置の追跡
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// アニメーションループ
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    dots.forEach(dot => {
        // マウスからの距離を計算
        const dx = mouseX - dot.baseX;
        const dy = mouseY - dot.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // マウスの影響を計算
        if (distance < mouseRadius) {
            const force = (1 - distance / mouseRadius) * 20;
            dot.x = dot.baseX + (dx / distance) * force;
            dot.y = dot.baseY + (dy / distance) * force;
        } else {
            // 元の位置に戻る
            dot.x += (dot.baseX - dot.x) * 0.1;
            dot.y += (dot.baseY - dot.y) * 0.1;
        }
        
        // ドットを描画
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = '#999999';
        ctx.fill();
    });
    
    requestAnimationFrame(animate);
}

animate();

// リサイズ時にドットを再初期化
window.addEventListener('resize', () => {
    resizeCanvas();
    initDots();
});

// スクロールアニメーション
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// モバイルメニュー
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // この 'active' クラスに対応するCSSを style.css に記述する必要があります
});

// ナビゲーションのスクロール制御
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        nav.style.transform = 'translateY(0)';
        return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
        // 下にスクロール
        nav.style.transform = 'translateY(-100%)';
    } else {
        // 上にスクロール
        nav.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// タイピングアニメーション（役割表示）
const roles = ['AI Engineer', 'Community Builder', 'Tech Innovator'];
let currentRoleIndex = 0;
const roleElements = document.querySelectorAll('.role');

setInterval(() => {
    roleElements.forEach((el, index) => {
        el.style.opacity = '0.3';
    });
    if (roleElements[currentRoleIndex]) { // 要素が存在するか確認
        roleElements[currentRoleIndex].style.opacity = '1';
    }
    currentRoleIndex = (currentRoleIndex + 1) % roles.length;
}, 2000);
