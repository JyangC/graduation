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

    // iOS/Safari: 클릭 이벤트 안에서 동기적으로 호출하는 게 제일 안정적
    bgm.volume = 0.25;

    const p = bgm.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        playing = true;
        if (toggleMusicBtn) toggleMusicBtn.textContent = "음악 끄기";
      }).catch((err) => {
        console.log("BGM blocked:", err);
        // 막혀도 UI는 그대로 진행
      });
    } else {
      // 오래된 브라우저 fallback
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
  // 3) Model camera: "정면" 리셋
  // -----------------------------
  // 기본 정면 프리셋 (필요하면 값만 바꿔서 미세조정)
  const FRONT_ORBIT = "0deg 75deg 2.2m";
  const FRONT_TARGET = "0m 0.9m 0m";

  function resetModelFront() {
    if (!mv) return;

    // 모델이 로드되기 전이면 로드 후에 적용
    const apply = () => {
      mv.setAttribute("camera-orbit", FRONT_ORBIT);
      mv.setAttribute("camera-target", FRONT_TARGET);
      // 즉시 스냅
      mv.setAttribute("camera-controls", "");
    };

    // 이미 로드되면 바로
    if (mv.loaded) {
      apply();
    } else {
      // load 이벤트 후 1회 적용
      const onLoad = () => {
        apply();
        mv.removeEventListener("load", onLoad);
      };
      mv.addEventListener("load", onLoad);
    }
  }

  // -----------------------------
  // 4) Open button: 전환 + 음악 + 모델
  // -----------------------------
  openBtn.addEventListener("click", () => {
    console.log("open clicked");

    // ✅ 1) 음악은 무조건 "가장 먼저" 동기 호출
    playBgmSync();

    // ✅ 2) 전환
    cover.classList.add("opening");
    content.classList.add("opened");

    // ✅ 3) 첫 화면 reveal은 전환 직후 바로 보이게
    setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("show"));
    }, 200);

    // ✅ 4) 모델 카메라를 정면으로 리셋
    // 전환 후 적용이 자연스러워서 약간 딜레이
    setTimeout(() => {
      resetModelFront();

      // 자동회전은 원하면 켜고, 싫으면 이 블록 삭제
      mv?.setAttribute("auto-rotate", "");
      mv?.setAttribute("rotation-per-second", "10deg");
      mv?.setAttribute("interaction-prompt", "once");
    }, 450);

    // ✅ 5) 커버 제거
    setTimeout(() => cover.remove(), 1000);
  });

  // -----------------------------
  // 5) Music toggle button
  // -----------------------------
  if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener("click", () => {
      if (!bgm) return;

      if (!playing) {
        playBgmSync();
      } else {
        pauseBgm();
      }
    });
  }
});
