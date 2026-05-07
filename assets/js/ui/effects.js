//鼠标
document.addEventListener("mousemove", e => {
    const light = document.createElement("div");
    light.className = "light";
    light.style.left = e.pageX + "px";
    light.style.top = e.pageY + "px";

    document.body.appendChild(light);
    setTimeout(() => light.remove(), 500);
});