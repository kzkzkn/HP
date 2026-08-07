/**
 * 株式会社AIの鉄人 — Direction C
 * Vanilla JS のみ（DESIGN.md §8.1 / CLAUDE.md §5）。外部ライブラリを使わない。
 */
(() => {
  "use strict";

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     ハンバーガーメニュー（aria-expanded / Escape で脱出）
     ------------------------------------------------------------------ */
  const initNavigation = () => {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#primary-nav");

    if (!header || !toggle || !nav) return;

    const setOpen = (isOpen) => {
      header.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // ナビ内のリンクを押したら閉じる
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    // Escape で閉じ、フォーカスをトグルへ戻す（フォーカストラップは作らない）
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      setOpen(false);
      toggle.focus();
    });

    // デスクトップ幅へ戻ったら開閉状態をリセット
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = (event) => {
      if (event.matches) setOpen(false);
    };

    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", onChange);
    }
  };

  /* ------------------------------------------------------------------
     スクロール時の軽いフェードイン（DESIGN.md §8.2）
     1要素につき1回のみ。reduced motion 時は何もしない。
     ------------------------------------------------------------------ */
  const initReveal = () => {
    const targets = document.querySelectorAll(
      ".hero__inner, .plate, .section__body, .proc__item, .svc__item"
    );

    if (!targets.length) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    targets.forEach((el) => el.classList.add("js-reveal"));

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

  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initReveal();
  });
})();
