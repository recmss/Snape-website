import {
  renderMusic,
} from "./render.js";

import {
  closeMusicForm,
  showAlert
} from "./ui.js";

function normalize(str = "") {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

/* =========================
   🚨 提交音乐（新增 + 编辑覆盖）
========================= */

export async function addMusic() {

  const title =
    document.getElementById("musicTitle")?.value.trim();

  const artist =
    document.getElementById("musicArtist")?.value.trim();

  const quote =
    document.getElementById("musicQuote")?.value.trim();

  let cover =
    document.getElementById("musicCover")?.value.trim();

  const musicLink =
    document.getElementById("musicLink")?.value.trim();

  let qqUrl = "";
  let neteaseUrl = "";

  /* =========================
     🎵 自动识别链接
  ========================= */

  if (musicLink && musicLink.includes("y.qq.com")) {
    qqUrl = musicLink;
  }

  if (musicLink && musicLink.includes("music.163.com")) {
    neteaseUrl = musicLink;
  }

  /* =========================
     ❗ 基础校验
  ========================= */

  if (!title || !artist) {
    showAlert("请至少填写歌曲名和歌手");
    return;
  }

  /* =========================
     🖼 自动封面
  ========================= */

  if (!cover) {
    try {
      cover = await getAutoCover(title, artist);
    } catch (err) {
      console.error("自动封面失败", err);
    }
  }

  /* =========================
     🚨 编辑 / 新增模式判断
  ========================= */

 
  const isEditing = window.editingId != null;
  

  /* =========================
     🚨 高级重复检查（仅新增时）
  ========================= */

  if (!isEditing) {

    const { data: existing } =
      await supabaseClient
        .from("music_list")
        .select("title, artist");

    const newTitle = normalize(title);
    const newArtist = normalize(artist);

    const isDuplicate = existing?.some(item => {
      return (
        normalize(item.title) === newTitle &&
        normalize(item.artist) === newArtist
      );
    });

    if (isDuplicate) {
      showAlert("该歌曲已存在");
      return;
    }
  }

  /* =========================
     🚀 写入数据库（核心修复）
  ========================= */

  let error;

  if (isEditing) {
    
    // ✏️ 编辑 → 覆盖原数据
    const res = await supabaseClient
      .from("music_list")
      .update({
        title,
        artist,
        quote,
        cover,
        qq_url: qqUrl,
        netease_url: neteaseUrl
      })
      
      
      .eq("id", window.editingId?.toString());
      
      console.log("📦 update result =", res);
    error = res.error;

  } else {

    // ➕ 新增
    const res = await supabaseClient
      .from("music_list")
      .insert([
        {
          title,
          artist,
          quote,
          cover,
          qq_url: qqUrl,
          netease_url: neteaseUrl
        }
      ]);

    error = res.error;
  }

  /* =========================
     ❌ 失败处理
  ========================= */

  if (error) {
    console.error(error);
    showAlert("提交失败");
    return;
  }

  /* =========================
     ✅ 成功处理
  ========================= */

  showAlert("提交成功！");

  closeMusicForm();

    await renderMusic();

  clearMusicForm();

  // ⭐ 清空编辑状态（关键）
  window.editingId = null;
}

/* =========================
   🧹 清空表单
========================= */

function clearMusicForm() {

  const ids = [
    "musicLink",
    "musicTitle",
    "musicArtist",
    "musicQuote",
    "musicCover"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

/* =========================
   🌍 暴露
========================= */

window.addMusic = addMusic;