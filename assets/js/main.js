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

    /*
     * observerFired は「IntersectionObserver の仕組み自体が動いているか」のフラグ。
     * IO は正常な環境では observe() 直後に必ず初回コールバックが発火する
     * （画面外の要素でも isIntersecting: false のエントリが来る）ため、
     * 一度も発火していない = IO が機能していない環境、と判定できる。
     */
    let observerFired = false;

    const observer = new IntersectionObserver(
      (entries) => {
        observerFired = true;
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
     * .reveal は opacity:0 で始まるため、IO が実質的に働かない環境では本文が
     * 見えないまま残ってしまう。働かないケースは2種類ある。
     *   a) コールバックが一度も発火しない
     *      （プレレンダリング・一部クローラ・スクロールを伴わない自動化環境）
     *   b) 初回コールバックは発火するが、以後スクロールが起きないため
     *      ファーストビュー外の要素が永久に可視にならない
     *      （バックグラウンドタブ・ヘッドレス描画・リンクプレビュー生成など、
     *        文書が不可視のまま読み込まれる場合）
     * b) は observerFired では検出できない。IO は observe() 直後に
     * isIntersecting:false の初回エントリを返すため、不可視の文書でも
     * observerFired が true になってしまうからである。
     *
     * 不可視の文書には「スクロールに連れて現れる」という体験自体が存在しないので、
     * 判定は単純に「文書が不可視なら全部出す」でよい。
     * 文書が可視な通常のブラウザではどちらの条件も成立せず、スクロール連動の
     * フェードイン（DESIGN.md §8.2）はそのまま生きる。
     */
    const revealAll = () => {
      observer.disconnect();
      targets.forEach((target) => target.classList.add("is-visible"));
    };

    const shouldForceReveal = () =>
      !observerFired || document.visibilityState === "hidden";

    const scheduleFallback = () => {
      window.setTimeout(() => {
        if (shouldForceReveal()) {
          revealAll();
        }
      }, REVEAL_FALLBACK_DELAY);
    };

    if (document.readyState === "complete") {
      scheduleFallback();
    } else {
      window.addEventListener("load", scheduleFallback, { once: true });
    }
  };

  /*
   * init が途中で例外を投げると、.js .reveal（opacity:0）が付いたまま
   * 表示ロジックだけが失われ、本文が見えなくなる。HTML 側の onerror は
   * 「main.js の読み込み失敗」しか拾えないため、実行時エラーはここで受け止め、
   * js フラグを外して素の（アニメーション無しの）表示へ落とす。
   */
  const init = () => {
    try {
      initNavigation();
      initReveal();
    } catch (error) {
      document.documentElement.classList.remove("js");
      throw error; // 握りつぶさず、コンソールには残す
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
