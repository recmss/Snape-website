/* =========================
   🌐 Supabase 初始化
========================= */

const supabaseUrl = "https://bejfzyovqrdzkwjzkppf.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlamZ6eW92cXJkemt3anprcHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjU5NDAsImV4cCI6MjA5MzcwMTk0MH0.BkiZpAYwCzQTRDZMDVXDD5B4pJckORaujWi6DVyTu84";


const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);

/* =========================
   🚨 初始化（只允许一个）
========================= */

window.addEventListener("DOMContentLoaded", () => {
  console.log("music.js loaded");
  renderMusic();
});

/* =========================
   🎨 自动封面
========================= */
async function getAutoCover(title, artist, qqId = "", neteaseId = "") {

  const defaultCover = "./assets/img/default-cover.jpg";

  try {

    // 1️⃣ 优先网易云
    if (neteaseId) {
      const res = await fetch(`https://music.163.com/api/song/detail/?id=${neteaseId}&ids=[${neteaseId}]`);
      const data = await res.json();

      const cover = data.songs?.[0]?.album?.picUrl;
      if (cover) return cover;
    }

    // 2️⃣ QQ音乐兜底（可选）
    if (qqId) {
      const res = await fetch(`https://api.qq.jsproxy.top/song?id=${qqId}`);
      const data = await res.json();

      if (data?.cover) return data.cover;
    }

    // 3️⃣ iTunes兜底（最稳定）
    const query = encodeURIComponent(`${artist} ${title}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`
    );

    const data = await res.json();
    const cover = data.results?.[0]?.artworkUrl100;

    if (cover) return cover.replace("100x100", "600x600");

    // 4️⃣ 默认封面
    return defaultCover;

  } catch (e) {
    return defaultCover;
  }
}

/* =========================
   🚨 提交音乐
========================= */

async function addMusic() {
  const title = document.getElementById("musicTitle")?.value.trim();
  const artist = document.getElementById("musicArtist")?.value.trim();
  const quote = document.getElementById("musicQuote")?.value.trim();
  let cover = document.getElementById("musicCover")?.value.trim();
  const qqUrl = document.getElementById("qqUrl")?.value.trim();
  const neteaseUrl = document.getElementById("neteaseUrl")?.value.trim();

  // ❗校验
  if (!title || !artist || (!qqUrl && !neteaseUrl)) {
    showAlert("请至少填写歌名、歌手和一个音乐链接");
    return;
  }

  if (!cover) {
    cover = await getAutoCover(title, artist);
  }

  const { error } = await supabaseClient.from("music_list").insert([
    {
      title,
      artist,
      quote,
      cover,
      qq_url: qqUrl,
      netease_url: neteaseUrl
    }
  ]);

  if (error) {
    console.error(error);
    showAlert("提交失败");
    return;
  }

  showAlert("提交成功！");
  renderMusic();
}

/* =========================
   🎵 渲染列表
========================= */

async function renderMusic() {
  const container = document.getElementById("musicList");

  const { data } = await supabaseClient
    .from("music_list")
    .select("*")
    .order("created_at", { ascending: false });

  container.innerHTML = "";

  (data || []).forEach(item => {
    const card = document.createElement("div");
    
    card.className = "music-card";

    const defaultCover = "./assets/img/default-cover.jpg";

    const cover =
        item.cover && item.cover.trim()
            ? item.cover
            : defaultCover;

    card.innerHTML = `
      <div class="music-actions">
        <button onclick="editMusic(${item.id})">✏</button>
        <button onclick="deleteMusic(${item.id})">🗑</button>
      </div>

     <img src="${cover}" class="music-cover">

      <div class="music-main">
        <div>歌曲：${item.title}</div>
        <div>歌手：${item.artist}</div>
        <div>推荐原因：${item.quote || "暂无"}</div>

        <div class="music-links">
          ${item.qq_url ? `<a href="${item.qq_url}" target="_blank">QQ</a>` : ""}
          ${item.netease_url ? `<a href="${item.netease_url}" target="_blank">网易</a>` : ""}
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

/* =========================
   🗑 删除
========================= */
let deleteTargetId = null;

/* =========================
   🗑 删除按钮
========================= */
function deleteMusic(id) {

  console.log("点击删除:", id);

  deleteTargetId = id;

  const modal = document.getElementById("deleteModal");

  console.log("modal:", modal);

  modal.classList.add("show");
}

/* =========================
   ✅ 确认删除
========================= */
async function confirmDeleteMusic() {

  console.log("确认删除触发");

  if (!deleteTargetId) {
    console.log("没有目标id");
    return;
  }

  const { error } = await supabaseClient
    .from("music_list")
    .delete()
    .eq("id", deleteTargetId);

  if (error) {
    console.error("删除失败:", error);
    return;
  }

  deleteTargetId = null;

  closeDeleteModal();
  renderMusic();
}

/* =========================
   ❌ 关闭弹窗
========================= */
function closeDeleteModal() {
  const modal = document.getElementById("deleteModal");

  if (modal) modal.classList.remove("show");
}

/* =========================
   🎯 关键绑定（最容易出错）
========================= */
window.addEventListener("DOMContentLoaded", () => {

  console.log("DOM ready");

  const btn = document.getElementById("confirmDeleteBtn");

  console.log("confirmDeleteBtn:", btn);

  if (!btn) {
    console.error("❌ confirmDeleteBtn 没找到");
    return;
  }

  btn.addEventListener("click", () => {
    console.log("确认按钮点击");
    confirmDeleteMusic();
  });
});




/* =========================
   ✏️ 编辑
========================= */

async function editMusic(id) {
  const { data } = await supabaseClient
    .from("music_list")
    .select("*")
    .eq("id", id)
    .single();

  document.getElementById("musicTitle").value = data.title;
  document.getElementById("musicArtist").value = data.artist;
  document.getElementById("musicQuote").value = data.quote;
  document.getElementById("musicCover").value = data.cover;
  document.getElementById("qqUrl").value = data.qq_url;
  document.getElementById("neteaseUrl").value = data.netease_url;

  window.editingId = id;
}


/* =========================
   🚨 弹窗（修复关键）
========================= */

function showAlert(message) {
  const box = document.getElementById("customAlert");
  const text = document.getElementById("alertText");

  if (!box || !text) return;

  text.textContent = message;

  box.classList.remove("show");
  void box.offsetWidth; // 强制重绘
  box.classList.add("show");

  console.log("弹窗:", message);
}

function closeAlert() {
  document.getElementById("customAlert").classList.remove("show");
}



/* =========================
   🌍 暴露
========================= */

window.addMusic = addMusic;
window.editMusic = editMusic;
window.deleteMusic = deleteMusic;
window.showAlert = showAlert;
window.closeAlert = closeAlert;
window.renderMusic = renderMusic;

