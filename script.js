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

  /* -----------------------------
     1) Reveal (스크롤 페이드인)
  ----------------------------- */
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));

  /* -----------------------------
     2) BGM (iOS-safe)
  ----------------------------- */
  let playing = false;

  function setMusicLabel() {
    if (!toggleMusicBtn) return;
    toggleMusicBtn.textContent = playing ? "음악 끄기" : "음악 켜기";
  }

  function playBgmSync() {
    if (!bgm) return;
    bgm.volume = 0.25;

    const p = bgm.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        playing = true;
        setMusicLabel();
      }).catch((err) => {
        console.log("BGM blocked:", err);
      });
    } else {
      playing = true;
      setMusicLabel();
    }
  }

  function pauseBgm() {
    if (!bgm) return;
    bgm.pause();
    playing = false;
    setMusicLabel();
  }

  /* -----------------------------
     3) Open transition
  ----------------------------- */
  function openInvitation() {
    cover.classList.add("opening");
    cover.style.pointerEvents = "none";
    content.classList.add("opened");

    // 애니메이션이 보일 만큼은 남겨두고 제거
    setTimeout(() => {
      if (cover && cover.parentNode) cover.parentNode.removeChild(cover);
    }, 900);
  }

  /* -----------------------------
     4) Model rotate start (전환 후)
     - 카메라/프레이밍은 절대 건드리지 않음(자동 프레이밍 유지)
  ----------------------------- */
  function startRotateAfterOpen() {
    if (!mv) return;

    const start = () => {
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("rotation-per-second", "-10deg");
      mv.setAttribute("interaction-prompt", "once");
    };

    // 로딩 완료면 즉시, 아니면 load 후 1회
    if (mv.loaded) start();
    else mv.addEventListener("load", start, { once: true });
  }

  /* -----------------------------
     5) Button handlers
  ----------------------------- */
  openBtn.addEventListener("click", (e) => {
    e.preventDefault(); // 혹시 a 태그여도 안전
    console.log("open clicked");

    // 1) 음악은 클릭 이벤트에서 먼저 시도 (iOS 정책 대응)
    playBgmSync();

    // 2) 초대장 열기
    openInvitation();

    // 3) 모델 회전은 전환 후 시작
    setTimeout(startRotateAfterOpen, 650);
  });

  if (toggleMusicBtn) {
    setMusicLabel();
    toggleMusicBtn.addEventListener("click", () => {
      if (!bgm) return;
      playing ? pauseBgm() : playBgmSync();
    });
  }
});
