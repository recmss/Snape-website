// ===============================
// 🌌 Snape Tag Cloud（重构稳定版）
// ===============================

const canvas = document.getElementById("tagCanvas");

// 如果当前页面没有 canvas，直接退出（避免报错）
if (!canvas) {
    console.warn("tagCloud: canvas not found");
} else {

    const ctx = canvas.getContext("2d");

    // ===============================
    // 🧠 关键词数据
    // ===============================
    const words = [
        { text: "Severus", weight: 10, emotion: "dark" },
        { text: "Snape", weight: 9, emotion: "dark" },
        { text: "学习", weight: 8, emotion: "love" },
        { text: "守护", weight: 7, emotion: "love" },
        { text: "牺牲", weight: 7, emotion: "neutral" },

        { text: "双面间谍", weight: 6, emotion: "neutral" },
        { text: "魔药课", weight: 5, emotion: "neutral" },
        { text: "霍格沃兹", weight: 5, emotion: "neutral" },

        { text: "孤独", weight: 6, emotion: "cold" },
        { text: "误解", weight: 6, emotion: "cold" },

        { text: "黑魔法", weight: 5, emotion: "dark" },
        { text: "阴影", weight: 6, emotion: "dark" },

        { text: "爱", weight: 9, emotion: "love" },
        { text: "秘密", weight: 6, emotion: "cold" },
        { text: "救赎", weight: 8, emotion: "love" }
    ];

    const radius = 160;
    let tags = [];

    // ===============================
    // 🎨 情绪配色系统
    // ===============================
    function getEmotionColor(emotion) {

        const palette = {
            love: [
                { r: 255, g: 160, b: 120 },
                { r: 255, g: 120, b: 120 },
                { r: 255, g: 200, b: 140 }
            ],
            neutral: [
                { r: 140, g: 190, b: 160 },
                { r: 120, g: 170, b: 150 },
                { r: 150, g: 200, b: 180 }
            ],
            cold: [
                { r: 140, g: 160, b: 190 },
                { r: 120, g: 140, b: 170 },
                { r: 160, g: 170, b: 200 }
            ],
            dark: [
                { r: 120, g: 90, b: 140 },
                { r: 90, g: 90, b: 120 },
                { r: 110, g: 80, b: 100 }
            ]
        };

        const list = palette[emotion] || palette.neutral;
        return list[Math.floor(Math.random() * list.length)];
    }

    // ===============================
    // 📦 初始化球体分布
    // ===============================
    words.forEach((word, i) => {

        const k = -1 + (2 * (i + 1) - 1) / words.length;
        const a = Math.acos(k);
        const b = a * Math.sqrt(words.length * Math.PI);

        tags.push({
            text: word.text,
            weight: word.weight,
            color: getEmotionColor(word.emotion),
            x: radius * Math.sin(a) * Math.cos(b),
            y: radius * Math.sin(a) * Math.sin(b),
            z: radius * Math.cos(a)
        });
    });

    // ===============================
    // 🎮 旋转参数
    // ===============================
    let angleX = 0.0015;
    let angleY = 0.0015;

    // ===============================
    // 🖱 鼠标控制
    // ===============================
    canvas.addEventListener("mousemove", e => {

        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left - canvas.width / 2;
        const y = e.clientY - rect.top - canvas.height / 2;

        angleY = x * 0.00003;
        angleX = y * 0.00003;
    });

    // ===============================
    // ✨ 渲染
    // ===============================
    function draw() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        tags.forEach(tag => {

            // X旋转
            let y = tag.y * Math.cos(angleX) - tag.z * Math.sin(angleX);
            let z = tag.z * Math.cos(angleX) + tag.y * Math.sin(angleX);
            tag.y = y;
            tag.z = z;

            // Y旋转
            let x = tag.x * Math.cos(angleY) - tag.z * Math.sin(angleY);
            z = tag.z * Math.cos(angleY) + tag.x * Math.sin(angleY);
            tag.x = x;
            tag.z = z;

            // 透视
            const scale = 400 / (400 + tag.z);
            const x2d = tag.x * scale + canvas.width / 2;
            const y2d = tag.y * scale + canvas.height / 2;

            const fontSize = (14 + tag.weight * 2) * scale;

            const { r, g, b } = tag.color;
            const alpha = Math.max(0.5, scale);

            ctx.font = `${fontSize}px Georgia`;

            ctx.shadowBlur = 6 * scale;
            ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;

            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

            ctx.fillText(tag.text, x2d, y2d);
        });

        requestAnimationFrame(draw);
    }

    draw();
}