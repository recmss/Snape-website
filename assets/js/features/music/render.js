/* =========================
   🎵 数据缓存
========================= */

export let allMusicCache = [];

/* =========================
   🎵 渲染列表（主函数）
========================= */

export async function renderMusic(customData = null) {

  console.log("🔥 renderMusic start");

  const container = document.getElementById("musicList");

  if (!container) {
    console.error("❌ musicList 不存在");
    return;
  }

  let data = customData;

  // 👉 没传数据就从数据库拉
  if (!data) {

    const result = await supabaseClient
      .from("music_list")
      .select("*")
      .order("created_at", {
        ascending: false
      });

    data = result.data || [];

    allMusicCache = data;
  }

  console.log("data =", data);

  container.innerHTML = "";

  data.forEach(item => {

    const card = document.createElement("div");

    card.className = "music-card";
    card.dataset.id = item.id;

    card.innerHTML = `
      <!-- 🎵 封面 -->
      <img 
        src="${
          item.cover?.trim()
            ? item.cover
            : "./assets/img/default-cover.jpg"
        }" 
        class="music-cover"
        onerror="this.src='./assets/img/default-cover.jpg'"
      >

      <!-- 🎮 操作按钮 -->
      <div class="music-actions">
        <button onclick="editMusic(${item.id})">✏</button>
        <button onclick="deleteMusic(${item.id})">🗑</button>
      </div>

      <!-- 🎵 主内容 -->
      <div class="music-main">

        <div class="music-info">
          <span class="music-label">歌曲：</span>
          <span class="title">${item.title || "未知"}</span>
        </div>

        <div class="music-info">
          <span class="music-label">歌手：</span>
          <span class="artist">${item.artist || "未知"}</span>
        </div>

        <div class="music-reason">
          <span class="music-label">推荐理由：</span>
          ${item.quote || "暂无"}
        </div>

        <!-- 🎧 音乐链接（必须在 music-main 内） -->
        <div class="music-links">

          ${
            item.qq_url
              ? `<a href="${item.qq_url}" target="_blank">QQ音乐</a>`
              : ""
          }

          ${
            item.netease_url
              ? `<a href="${item.netease_url}" target="_blank">网易云</a>`
              : ""
          }

        </div>

      </div>
    `;

    container.appendChild(card);
  });
}

/* =========================
   ✨ 局部更新（编辑用）
========================= */

export function updateMusicCard(item) {

  const card = document.querySelector(
    `[data-id="${item.id}"]`
  );

  if (!card) return;

  card.innerHTML = `
    <!-- 🎵 封面 -->
    <img 
      src="${
        item.cover?.trim()
          ? item.cover
          : "./assets/img/default-cover.jpg"
      }" 
      class="music-cover"
      onerror="this.src='./assets/img/default-cover.jpg'"
    >

    <!-- 🎮 操作按钮 -->
    <div class="music-actions">
      <button onclick="editMusic(${item.id})">✏</button>
      <button onclick="deleteMusic(${item.id})">🗑</button>
    </div>

    <!-- 🎵 主内容 -->
    <div class="music-main">

      <div class="music-info">
        <span class="music-label">歌曲：</span>
        <span class="title">${item.title || "未知歌曲"}</span>
      </div>

      <div class="music-info">
        <span class="music-label">歌手：</span>
        <span class="artist">${item.artist || "未知歌手"}</span>
      </div>

      <div class="music-reason">
        <span class="music-label">推荐理由：</span>
        ${item.quote || "暂无推荐理由"}
      </div>

      <!-- 🎧 音乐链接 -->
      <div class="music-links">

        ${
          item.qq_url
            ? `<a href="${item.qq_url}" target="_blank">QQ音乐</a>`
            : ""
        }

        ${
          item.netease_url
            ? `<a href="${item.netease_url}" target="_blank">网易云</a>`
            : ""
        }

      </div>

    </div>
  `;
}