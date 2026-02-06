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

  openBtn.addEventListener("click", async () => {
    console.log("open clicked"); // ✅ 디버그용 (잘 되면 콘솔에 찍힘)
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("show"));


    // 화면 전환 먼저 (음악이 막혀도 넘어가게)
    cover.classList.add("hide");
    content.classList.add("show");
    setTimeout(() => cover.remove(), 800);

    // 모델 자동회전(원치 않으면 삭제)
    if (mv) {
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("rotation-per-second", "10deg");
    }

    // 음악 재생은 try로 (모바일 정책 때문에 실패 가능)
    if (bgm) {
      try {
        bgm.volume = 0.22;
        await bgm.play();
        playing = true;
        if (toggleMusicBtn) toggleMusicBtn.textContent = "음악 끄기";
      } catch (e) {
        console.log("BGM blocked:", e);
      }
    }
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
