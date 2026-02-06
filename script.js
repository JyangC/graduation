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
  console.log("open clicked"); // 🔍 확인용

  // 1) 음악 먼저 시도 (실패해도 OK)
  try { await tryPlay(); } catch(e){}

  // 2) 전환 클래스 부여 (핵심)
  cover.classList.add("opening");
  content.classList.add("opened");

  // 3) 텍스트 reveal은 전환 직후
  setTimeout(() => {
    document.querySelectorAll(".reveal")
      .forEach(el => el.classList.add("show"));
  }, 200);

  // 4) 모델 자동회전(선택)
  setTimeout(() => {
    mv?.setAttribute("auto-rotate", "");
    mv?.setAttribute("rotation-per-second", "10deg");
  }, 500);

  // 5) 커버 완전 제거
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
