window.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgm");
  const cover = document.getElementById("cover");
  const content = document.getElementById("content");
  const openBtn = document.getElementById("openBtn");
  const mv = document.getElementById("mv");
  const toggleMusicBtn = document.getElementById("toggleMusic");

  // 필수 요소 체크
  if (!cover || !content || !openBtn) {
    console.log("Missing elements:", { cover, content, openBtn });
    return;
  }

  // -----------------------------
  // 1) Reveal (스크롤 페이드인)
  // -----------------------------
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  reveals.forEach((el) => io.observe(el));

  // -----------------------------
  // 2) Music helpers (iOS 안정)
  // -----------------------------
  let playing = false;

  function playBgmSync() {
    if (!bgm) return;
    bgm.volume = 0.25;
    const p = bgm.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        playing = true;
        if (toggleMusicBtn) toggleMusicBtn.textContent = "음악 끄기";
      }).catch((err) => console.log("BGM blocked:", err));
    } else {
      playing = true;
      if (toggleMusicBtn) toggleMusicBtn.textContent = "음악 끄기";
    }
  }

  function pauseBgm() {
    if (!bgm) return;
    bgm.pause();
    playing = false;
    if (toggleMusicBtn) toggleMusicBtn.textContent = "음악 켜기";
  }

  // -----------------------------
  // 3) Open transition (무조건 열리게)
  // -----------------------------
  function openInvitation() {
    // 커버 → 사라짐 애니메이션
    cover.classList.add("opening");

    // 본문 → 보이기
    content.classList.add("opened");

    // 혹시 CSS에서 cover가 남아있어도 클릭 막지 않게
    cover.style.pointerEvents = "none";

    // 커버 제거 (애니메이션 끝난 뒤)
    setTimeout(() => {
      try { cover.remove(); } catch (e) {}
    }, 900);
  }

  // -----------------------------
  // 4) Model rotate start (전환 후)
  // -----------------------------
  function startRotateAfterOpen() {
    if (!mv) return;
    // 로딩 중에는 안 돌게 (안전)
    mv.removeAttribute("auto-rotate");

    const start = () => {
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("rotation-per-second", "10deg");
      mv.setAttribute("interaction-prompt", "once");
    };

    if (mv.loaded) start();
    else mv.addEventListener("load", start, { once: true });
  }

  // -----------------------------
  // 5) Button handlers
  // -----------------------------
  openBtn.addEventListener("click", () => {
    console.log("open clicked");

    // 1) 음악은 클릭 이벤트 안에서 먼저 시도
    playBgmSync();

    // 2) 초대장 열기(이건 무조건 실행)
    openInvitation();

    // 3) 모델 회전은 전환 후 시작
    setTimeout(() => startRotateAfterOpen(), 650);
  });

  if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener("click", () => {
      if (!bgm) return;
      if (!playing) playBgmSync();
      else pauseBgm();
    });
  }
});
