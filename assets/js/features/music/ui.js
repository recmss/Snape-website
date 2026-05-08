import {
  renderMusic,
  allMusicCache
} from "./render.js";

/* =========================
   🔍 搜索
========================= */

export function searchMusic(keyword) {

  keyword = keyword
    .trim()
    .toLowerCase();

  if (!keyword) {

    renderMusic(allMusicCache);

    return;
  }

  const filtered =
    allMusicCache.filter(item =>

      (item.title || "")
      .toLowerCase()
      .includes(keyword)

      ||

      (item.artist || "")
      .toLowerCase()
      .includes(keyword)

    );

  renderMusic(filtered);
}

/* =========================
   🚨 Alert
========================= */

export function showAlert(message) {

  const box =
    document.getElementById(
      "customAlert"
    );

  const text =
    document.getElementById(
      "alertText"
    );

  if (!box || !text) return;

  text.textContent = message;

  box.classList.remove("show");

  void box.offsetWidth;

  box.classList.add("show");
}

export function closeAlert() {

  document
    .getElementById("customAlert")
    .classList.remove("show");
}

/* =========================
   🎭 添加弹窗
========================= */

export function openMusicForm() {

  const popup =
    document.getElementById(
      "musicFormPopup"
    );

  popup.classList.add("show");
}


export function closeMusicForm() {

  const popup =
    document.getElementById(
      "musicFormPopup"
    );

  if (popup) {

    popup.classList.remove(
      "show"
    );
  }

  /* =========================
     🧹 清空表单
  ========================= */

  const ids = [

    "musicLink",

    "musicTitle",

    "musicArtist",

    "musicQuote",

    "musicCover",

    "qqUrl",

    "neteaseUrl"

  ];

  ids.forEach(id => {

    const el =
      document.getElementById(id);

    if (el) {

      el.value = "";
    }
  });

  /* =========================
     ✏️ 清空编辑状态
  ========================= */

  window.editingId = null;
}

window.showAlert = showAlert;

window.closeAlert = closeAlert;

window.closeMusicForm =
  closeMusicForm;