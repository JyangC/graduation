const bgm = document.getElementById("bgm");
const cover = document.getElementById("cover");
const content = document.getElementById("content");
const openBtn = document.getElementById("openBtn");
const mv = document.getElementById("mv");
const toggleMusicBtn = document.getElementById("toggleMusic");

let playing = false;

// 초대장 열기: 음악 시작 + 본문 표시 + (선택) 모델 자동회전 시작
openBtn.addEventListener("click", async () => {
  // 1) 음악 재생 (모바일은 사용자 클릭이 있어야 재생 가능)
  try {
    bgm.volume = 0.22; // 부모님용: 작게
    await bgm.play();
    playing = true;
    if (toggleMusicBtn) toggleMusicBtn.textContent = "음악 끄기";
  } catch (e) {
    // 재생이 막혀도 초대장은 열리게
    console.log("BGM blocked:", e);
  }

  // 2) 화면 전환
  cover.classList.add("hide");
  content.classList.add("show");

  // 3) 열기 후 모델만 살짝 자동회전 (원치 않으면 아래 2줄 삭제)
  if (mv) {
    mv.setAttribute("auto-rotate", "");
    mv.setAttribute("rotation-per-second", "10deg");
  }

  // 4) 커버 제거(선택)
  setTimeout(() => cover.remove(), 800);
});

// 음악 토글 버튼(본문 하단)
if (toggleMusicBtn) {
  toggleMusicBtn.addEventListener("click", async () => {
    if (!playing) {
      try {
        bgm.volume = 0.22;
        await bgm.play();
        playing = true;
        toggleMusicBtn.textContent = "음악 끄기";
      } catch (e) {
        console.log("BGM blocked:", e);
      }
      return;
    }

    bgm.pause();
    playing = false;
    toggleMusicBtn.textContent = "음악 켜기";
  });
}
