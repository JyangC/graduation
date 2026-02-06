window.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgm");
  const cover = document.getElementById("cover");
  const content = document.getElementById("content");
  const openBtn = document.getElementById("openBtn");
  const mv = document.getElementById("mv");
  const toggleMusicBtn = document.getElementById("toggleMusic");

  if (!openBtn || !cover || !content) {
    console.log("Missing elements:", { openBtn, cover, content });
    return;

  // 스크롤 페이드인(C)
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  
  reveals.forEach(el => io.observe(el));



    
  }

  let playing = false;

  openBtn?.addEventListener("click", async () => {
  // 1) 음악 먼저 시도
  await tryPlay();

  // 2) 전환 시작
  cover.classList.add("opening");
  content.classList.add("opened");

  // 3) reveal 텍스트는 전환 후 등장
  setTimeout(() => {
    document.querySelectorAll(".reveal").forEach(el =>
      el.classList.add("show")
    );
  }, 300);

  // 4) 모델 자동회전은 살짝 늦게
  setTimeout(() => {
    if (mv) {
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("rotation-per-second", "10deg");
    }
  }, 600);

  // 5) 커버 제거
  setTimeout(() => cover.remove(), 1000);
});


  if (toggleMusicBtn && bgm) {
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
      } else {
        bgm.pause();
        playing = false;
        toggleMusicBtn.textContent = "음악 켜기";
      }
    });
  }
});
