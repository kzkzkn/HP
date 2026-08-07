/*
 * 株式会社AIの鉄人 — Direction A: Editorial
 * Vanilla JS のみ（DESIGN.md §8.1 / CLAUDE.md §5）。外部ライブラリを追加しない。
 *   1. ハンバーガーメニューの開閉（aria-expanded / Escape / リサイズ復帰）
 *   2. IntersectionObserver による控えめなフェードイン（1要素につき1回）
 *      ＋ 発火しない環境向けのタイムアウトフォールバック
 */
(() => {
  "use strict";

  /* 横並びナビへ切り替わる幅。style.css のヘッダー用メディアクエリと一致させる */
  const DESKTOP_QUERY = "(min-width: 1024px)";

  /* reveal のフォールバック待ち時間（load 後） */
  const REVEAL_FALLBACK_DELAY = 1500;

  /* ---------------------------------------------------------------- */
  /* 1. Navigation                                                     */
  /* ---------------------------------------------------------------- */
  const initNavigation = () => {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#primary-nav");

    if (!header || !toggle || !nav) {
      return;
    }

    const setMenuOpen = (isOpen) => {
      header.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    };

    toggle.addEventListener("click", () => {
      setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // メニュー内のリンクを踏んだら閉じる
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setMenuOpen(false);
      }
    });

    // Escape で閉じ、フォーカスをトグルへ戻す（フォーカストラップは作らない）
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    // デスクトップ幅へ戻ったら開閉状態をリセットする
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const handleBreakpoint = (event) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };

    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", handleBreakpoint);
    } else if (typeof desktop.addListener === "function") {
      desktop.addListener(handleBreakpoint);
    }
  };

  /* ---------------------------------------------------------------- */
  /* 2. Reveal（DESIGN.md §8.2）                                       */
  /* ---------------------------------------------------------------- */
  const initReveal = () => {
    const targets = document.querySelectorAll(".reveal");

    if (!targets.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // IntersectionObserver 非対応、またはモーション低減設定のときは即時表示する
    if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // 1要素につき1回のみ
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    targets.forEach((target) => observer.observe(target));

    /*
     * フォールバック。
     * プレレンダリング・一部クローラ・スクロールを伴わない自動化環境などでは
     * IntersectionObserver のコールバックが発火せず、.reveal が opacity:0 のまま
     * 残ることがある。コンテンツが読めない状態を作らないため、load 完了から
     * 一定時間後に未表示の要素へ強制的に is-visible を付ける。
     */
    const revealAll = () => {
      observer.disconnect();
      targets.forEach((target) => target.classList.add("is-visible"));
    };

    const scheduleFallback = () => {
      window.setTimeout(revealAll, REVEAL_FALLBACK_DELAY);
    };

    if (document.readyState === "complete") {
      scheduleFallback();
    } else {
      window.addEventListener("load", scheduleFallback, { once: true });
    }
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
