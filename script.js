// 鼠标粒子
document.addEventListener("mousemove", e => {
    let light = document.createElement("div");
    light.className = "light";
    light.style.left = e.pageX + "px";
    light.style.top = e.pageY + "px";
    document.body.appendChild(light);
    setTimeout(() => light.remove(), 500);
});

// 滑动下划线
const nav = document.querySelector(".nav");
const line = document.querySelector(".nav-line");
const active = document.querySelector(".nav a.active");

function moveLine(el) {
    line.style.width = el.offsetWidth + "px";
    line.style.left = el.offsetLeft + "px";
}

if (active) moveLine(active);

document.querySelectorAll(".nav a").forEach(item => {
    item.addEventListener("mouseenter", () => moveLine(item));
    item.addEventListener("mouseleave", () => moveLine(active));
});



// 关键词云
const canvas = document.getElementById("tagCanvas");
const ctx = canvas.getContext("2d");

/* 带权重关键词 */
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

/* 🎨 情绪配色系统 */
function getEmotionColor(emotion) {

    const palette = {
        love: [
            { r: 255, g: 160, b: 120 }, // 暖橙
            { r: 255, g: 120, b: 120 }, // 浅红
            { r: 255, g: 200, b: 140 }  // 金色
        ],

        neutral: [
            { r: 140, g: 190, b: 160 }, // 雾绿
            { r: 120, g: 170, b: 150 },
            { r: 150, g: 200, b: 180 }
        ],

        cold: [
            { r: 140, g: 160, b: 190 }, // 冷蓝
            { r: 120, g: 140, b: 170 },
            { r: 160, g: 170, b: 200 }
        ],

        dark: [
            { r: 120, g: 90, b: 140 },  // 紫
            { r: 90, g: 90, b: 120 },   // 深蓝紫
            { r: 110, g: 80, b: 100 }   // 暗色
        ]
    };

    const list = palette[emotion] || palette.neutral;
    return list[Math.floor(Math.random() * list.length)];
}

/* 初始化球面 */
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

/* 初始旋转 */
let angleX = 0.0015;
let angleY = 0.0015;

/* 鼠标控制（更丝滑） */
canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;

    angleY = x * 0.00003;
    angleX = y * 0.00003;
});

/* 绘制 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tags.forEach(tag => {

        // X轴旋转
        let y = tag.y * Math.cos(angleX) - tag.z * Math.sin(angleX);
        let z = tag.z * Math.cos(angleX) + tag.y * Math.sin(angleX);
        tag.y = y;
        tag.z = z;

        // Y轴旋转
        let x = tag.x * Math.cos(angleY) - tag.z * Math.sin(angleY);
        z = tag.z * Math.cos(angleY) + tag.x * Math.sin(angleY);
        tag.x = x;
        tag.z = z;

        // 透视
        const scale = 400 / (400 + tag.z);
        const x2d = tag.x * scale + canvas.width / 2;
        const y2d = tag.y * scale + canvas.height / 2;

        /* 根据权重控制大小 */
        const fontSize = (14 + tag.weight * 2) * scale;

        const { r, g, b } = tag.color;
        const alpha = Math.max(0.5, scale);


        ctx.font = `${fontSize}px Georgia`;

        /* 发光（稍微柔一点） */
        ctx.shadowBlur = 6 * scale;
        ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;


        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

        ctx.fillText(tag.text, x2d, y2d);
    });

    requestAnimationFrame(draw);
}


draw();