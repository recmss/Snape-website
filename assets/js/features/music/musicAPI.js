/* =========================
   📦 引入 UI
========================= */


import {
  showAlert
} from "./ui.js";

/* =========================
   🎵 自动解析音乐链接
========================= */

async function parseMusicLink() {

  const link =
    document.getElementById(
      "musicLink"
    )?.value
      .trim();

  if (!link) {

    showAlert(
      "请先输入音乐链接"
    );

    return;
  }

  /* =========================
     🎵 网易云
  ========================= */

  if (
    link.includes(
      "music.163.com"
    )
  ) {

    parseNetease(link);

    return;
  }

  /* =========================
     🎵 QQ音乐
  ========================= */

  if (
    link.includes(
      "y.qq.com"
    )
  ) {

    parseQQMusic(link);

    return;
  }

  showAlert(
    "暂不支持该链接"
  );
}

/* =========================
   🎵 网易云解析
========================= */

async function parseNetease(url) {

  try {

    /* =========================
       🔍 提取歌曲ID
    ========================= */

    const match =
      url.match(/id=(\d+)/);

    if (!match) {

      showAlert(
        "网易云链接解析失败"
      );

      return;
    }

    const songId = match[1];

    /* =========================
       🌐 API
    ========================= */

    const api =
      `https://api.i-meto.com/meting/api?server=netease&type=song&id=${songId}`;

    /* =========================
       🚀 请求
    ========================= */

    const res =
      await fetch(api);

    const data =
      await res.json();

    /* =========================
       ❌ 无数据
    ========================= */

    if (
      !data ||
      !data.length
    ) {

      showAlert(
        "未获取到歌曲信息"
      );

      return;
    }

    const song = data[0];

    /* =========================
       ✨ 自动填充
    ========================= */

    fillMusicForm({

      title:
        song.name,

      artist:
        song.artist,

      cover:
        song.pic
    });

    

    fillMusicForm({

        title:
            song.name ||
            song.title ||
            "",

        artist:
            song.artist ||
            song.author ||
            "",

        cover:
            song.pic ||
            song.cover ||
            ""
    });

    /* =========================
       🔗 自动写入链接
    ========================= */

    const neteaseInput =
      document.getElementById(
        "neteaseUrl"
      );

    if (neteaseInput) {

      neteaseInput.value =
        url;
    }

    showAlert("解析成功");

  } catch (err) {

    console.error(err);

    showAlert("解析失败");
  }
}

/* =========================
   🎵 QQ音乐解析
========================= */

async function parseQQMusic(url) {

  showAlert(
    "QQ音乐解析暂未开放"
  );
}

/* =========================
   ✨ 自动填充
========================= */

function fillMusicForm(data) {

  if (data.title) {

    document.getElementById(
      "musicTitle"
    ).value =
      data.title;
  }

  if (data.artist) {

    document.getElementById(
      "musicArtist"
    ).value =
      data.artist;
  }

  if (data.cover) {

    document.getElementById(
      "musicCover"
    ).value =
      data.cover;
  }
}

/* =========================
   🎯 绑定按钮
========================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const btn =
      document.getElementById(
        "parseMusicBtn"
      );

    if (btn) {

      btn.addEventListener(
        "click",
        parseMusicLink
      );
    }
  }
);