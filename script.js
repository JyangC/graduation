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
  }

  // -----------------------------
  // 1) Reveal (스크롤 페이드인)
  //    - "열기" 버튼으로 show를 강제하지 않음
  // -----------------------------
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );
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
      }).catch((err) => {
        console.log("BGM blocked:", err);
      });
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
  // 3) Model camera: 시작 구도(살짝 왼쪽) + 전환 후 회전
  // -----------------------------
  // ✅ 시작할 때 "살짝 왼쪽을 보고" 정지 상태
  const START_ORBIT = "40deg 68deg 1.55m";
  const START_TARGET = "0m 0.75m 0m";
  const ROTATE_SPEED = "10deg";

  function setModelStartPose() {
    if (!mv) return;
    mv.setAttribute("camera-orbit", START_ORBIT);
    mv.setAttribute("camera-target", START_TARGET);
    mv.setAttribute("field-of-view", "32deg");
  }

  function startAutoRotateWhenReady() {
    if (!mv) return;

    const start = () => {
      // 시작 구도를 먼저 강제 스냅
      setModelStartPose();

      // 그 다음에만 회전 시작 (로딩 중 회전 방지)
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("rotation-per-second", ROTATE_SPEED);
    };

    // 이미 로드 완료면 즉시
    if (mv.loaded) {
      start();
      return;
    }

    // 로딩 중이면 load 후 1회 실행
    mv.addEventListener("load", start, { once: true });
  }

  // 페이지 로드 시: 시작 구도는 미리 맞춰두되, 회전은 절대 시작하지 않음
  setModelStartPose();
  if (mv) mv.removeAttribute("auto-rotate");

  // -----------------------------
  // 4) Open button: 전환 + 음악 + (전환 후) 모델 회전 시작
  // -----------------------------
  openBtn.addEventListener("click", () => {
    console.log("open clicked");

    // ✅ 1) 음악은 무조건 "가장 먼저" 동기 호출
    playBgmSync();

    // ✅ 2) 전환
    cover.classList.add("opening");
    content.classList.add("opened");

    // ✅ 3) 전환이 끝난 뒤에만 회전 시작 (로드가 안 됐으면 load 대기)
    //  - 900ms: cover->content 전환 타이밍과 맞춤
    setTimeout(() => {
      startAutoRotateWhenReady();
      mv?.setAttribute("interaction-prompt", "once");
    }, 650);

    // ✅ 4) 커버 제거
    setTimeout(() => cover.remove(), 1000);
  });

  // -----------------------------
  // 5) Music toggle button
  // -----------------------------
  if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener("click", () => {
      if (!bgm) return;
      if (!playing) playBgmSync();
      else pauseBgm();
    });
  }
});
