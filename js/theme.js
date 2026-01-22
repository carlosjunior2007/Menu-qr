(function () {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");

  function renderIcon(name) {
    const old = document.getElementById("themeIcon");
    if (!old) return;

    // Re-crea el <i> (porque Lucide lo convierte a <svg> y ya no cambia)
    old.outerHTML = `<i id="themeIcon" class="h-5 w-5" data-lucide="${name}"></i>`;
    lucide.createIcons();
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    renderIcon(theme === "light" ? "moon" : "sun");
  }

  // init
  const saved = localStorage.getItem("theme");
  const initial = saved || "dark";
  setTheme(initial);

  // toggle
  if (btn) {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      setTheme(current === "light" ? "dark" : "light");
    });
  }
})();
