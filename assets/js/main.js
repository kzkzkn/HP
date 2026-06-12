(() => {
  const initNavigation = () => {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("#primary-nav");

    if (!header || !toggle || !nav) {
      return;
    }

    const setMenuOpen = (isOpen) => {
      header.classList.toggle("is-menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    nav.addEventListener("click", (event) => {
      const link = event.target.closest("a");

      if (link) {
        setMenuOpen(false);
      }
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
  });
})();
