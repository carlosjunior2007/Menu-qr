// ./js/apply-config.js
(function () {
  const cfg = window.MENU_CONFIG;
  if (!cfg) return;

  // ---- META ----
  const meta = cfg.meta || {};
  if (meta.title) document.title = meta.title;

  function upsertMeta(nameOrProp, value, isProperty = false) {
    if (!value) return;
    const selector = isProperty
      ? `meta[property="${nameOrProp}"]`
      : `meta[name="${nameOrProp}"]`;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      if (isProperty) el.setAttribute("property", nameOrProp);
      else el.setAttribute("name", nameOrProp);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  }

  upsertMeta("description", meta.description || "");
  upsertMeta("theme-color", meta.themeColor || "#0f0f0f");
  upsertMeta("og:title", meta.title || "", true);
  upsertMeta("og:description", meta.description || "", true);
  upsertMeta("og:image", meta.ogImage || "", true);

  // ---- COLORS -> CSS VARS ----
  function setVars(themeKey, vars) {
    const selector = themeKey === "light" ? 'html[data-theme="light"]' : ":root";
    let style = document.getElementById(`cfg-vars-${themeKey}`);
    if (!style) {
      style = document.createElement("style");
      style.id = `cfg-vars-${themeKey}`;
      document.head.appendChild(style);
    }

    const lines = Object.entries(vars || {})
      .map(([k, v]) => `  --${k}: ${v};`)
      .join("\n");

    style.textContent = `${selector} {\n${lines}\n}`;
  }

  setVars("dark", cfg.colors?.dark);
  setVars("light", cfg.colors?.light);

  // ---- UI TEXT (optional) ----
  const ui = cfg.ui || {};
  const kicker = document.querySelector("[data-ui='headerKicker']");
  const title = document.querySelector("[data-ui='restaurantName']");
  const recTitle = document.querySelector("[data-ui='recommendedTitle']");
  const menuTitle = document.querySelector("[data-ui='menuTitle']");

  if (kicker && ui.headerKicker) kicker.textContent = ui.headerKicker;
  if (title && ui.restaurantName) title.textContent = ui.restaurantName;
  if (recTitle && ui.recommendedTitle) recTitle.textContent = ui.recommendedTitle;
  if (menuTitle && ui.menuTitle) menuTitle.textContent = ui.menuTitle;
})();
