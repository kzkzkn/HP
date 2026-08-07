/*
 * 株式会社AIの鉄人 コーポレートサイト — Direction B
 * Vanilla JS のみ（DESIGN.md §8.1 / CLAUDE.md §5）。外部ライブラリを追加しない。
 */
(() => {
  "use strict";

  // JSが動く環境でのみスクロール演出の初期状態（opacity:0）を適用する
  document.documentElement.classList.add("js");

  const DESKTOP_QUERY = "(min-width: 769px)";

  /* ------------------------------------------------------------------
     グローバルナビゲーション（≤768px のハンバーガー）
     ------------------------------------------------------------------ */
  const initNavigation = () => {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("primary-nav");

    if (!header || !toggle || !nav) return;

    const setMenuOpen = (isOpen) => {
      header.classList.toggle("is-menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    };

    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

    setMenuOpen(false);

    toggle.addEventListener("click", () => {
      setMenuOpen(!isOpen());
    });

    // メニュー内のリンクを選んだら閉じる
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenuOpen(false);
    });

    // Escape で閉じ、フォーカスをトグルへ戻す（フォーカストラップは作らない）
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    // デスクトップ幅へ戻ったら状態をリセットする
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const handleBreakpoint = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", handleBreakpoint);
    } else if (typeof desktop.addListener === "function") {
      desktop.addListener(handleBreakpoint);
    }
  };

  /* ------------------------------------------------------------------
     スクロール時のフェードイン（1要素につき1回のみ / DESIGN.md §8.2）
     ------------------------------------------------------------------ */
  const initReveal = () => {
    const targets = document.querySelectorAll(".reveal");

    if (!targets.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduced.matches || typeof IntersectionObserver !== "function") {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    targets.forEach((el) => observer.observe(el));
  };

  const init = () => {
    initNavigation();
    initReveal();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
