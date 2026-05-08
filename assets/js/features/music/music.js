/* =========================
   🌐 Supabase 初始化
========================= */

const supabaseUrl = "https://bejfzyovqrdzkwjzkppf.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlamZ6eW92cXJkemt3anprcHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjU5NDAsImV4cCI6MjA5MzcwMTk0MH0.BkiZpAYwCzQTRDZMDVXDD5B4pJckORaujWi6DVyTu84";


window.supabaseClient =
  supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

/* =========================
   📦 模块
========================= */

import {
  renderMusic
} from "./render.js";

import {
  searchMusic,
  openMusicForm
} from "./ui.js";



import "./submit.js";

import "./musicApi.js";

/* =========================
   🚀 初始化
========================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "music.js loaded"
    );

    renderMusic();

    /* 🔍 搜索 */

    const searchInput =
      document.getElementById(
        "searchInput"
      );

    if (searchInput) {

      searchInput.addEventListener(
        "input",
        e => {

          searchMusic(
            e.target.value
          );

        }
      );
    }

    /* ➕ 打开弹窗 */

    const openBtn =
      document.getElementById(
        "openAddBtn"
      );

    if (openBtn) {

      openBtn.addEventListener(
        "click",
        openMusicForm
      );
    }

    /* 🗑 删除确认 */

    const btn =
      document.getElementById(
        "confirmDeleteBtn"
      );

    if (btn) {

      btn.addEventListener(
        "click",
        confirmDeleteMusic
      );
    }

  }
);

let deleteTargetId = null;

window.deleteMusic = function (id) {
  deleteTargetId = id;
  document.getElementById("deleteModal")?.classList.add("show");
};

window.closeDeleteModal = function () {
  document.getElementById("deleteModal")?.classList.remove("show");
};

window.confirmDeleteMusic = async function () {

  if (!deleteTargetId) return;

  const { error } = await supabaseClient
    .from("music_list")
    .delete()
    .eq("id", deleteTargetId);

  if (error) {
    console.error(error);
    return;
  }

  // ✅ 1. 关闭弹窗
  closeDeleteModal();

  // ✅ 2. 提示成功
  showAlert("删除成功");

  // ✅ 3. 重置状态
  deleteTargetId = null;

  // ✅ 4. 刷新列表
  renderMusic();

};

window.editMusic = async function (id) {

  const { data, error } = await supabaseClient
    .from("music_list")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  document.getElementById("musicTitle").value = data.title || "";
  document.getElementById("musicArtist").value = data.artist || "";
  document.getElementById("musicQuote").value = data.quote || "";
  document.getElementById("musicCover").value = data.cover || "";
  document.getElementById("qqUrl").value = data.qq_url || "";
  document.getElementById("neteaseUrl").value = data.netease_url || "";

  window.editingId = Number(id);
  window.isEditing = true;

  document.getElementById("musicFormPopup")?.classList.add("show");
};