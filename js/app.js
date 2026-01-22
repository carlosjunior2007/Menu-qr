// ./js/app.js
(function () {
  // 1) Render inicial
  if (window.MenuRender) window.MenuRender.renderAll();

  // 2) Sheet wiring (tu lógica, pero aplicada a TODO item en la página)
  const dishOverlay = document.getElementById("dishOverlay");
  const dishSheet = document.getElementById("dishSheet");
  const dishCloseBtn = document.getElementById("dishCloseBtn");

  const dishImg = document.getElementById("dishImg");
  const dishName = document.getElementById("dishName");
  const dishDesc = document.getElementById("dishDesc");
  const dishIngredients = document.getElementById("dishIngredients");
  const dishAllergens = document.getElementById("dishAllergens");
  const dishPrice = document.getElementById("dishPrice");
  const dishTime = document.querySelector("#dishTime span");
  const dishTags = document.getElementById("dishTags");

  const cfg = window.MENU_CONFIG;

  function capitalize(str) {
    const s = String(str || "");
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  function tagMeta(tagKey) {
    return (cfg && cfg.tags && cfg.tags[tagKey]) || { label: tagKey, icon: "tag" };
  }

  function openDishSheetFromCard(cardEl) {
    const data = {
      name: cardEl.dataset.name,
      desc: cardEl.dataset.desc,
      ingredients: cardEl.dataset.ingredients,
      allergens: cardEl.dataset.allergens,
      time: cardEl.dataset.time,
      price: cardEl.dataset.price,
      img: cardEl.dataset.img,
      tags: cardEl.dataset.tags,
    };

    dishImg.src = data.img || "";
    dishImg.alt = data.name || "Dish image";

    dishName.textContent = data.name || "Dish";
    dishDesc.textContent = data.desc || "No description yet.";
    dishIngredients.textContent = data.ingredients || "—";
    dishAllergens.textContent = data.allergens || "None declared";
    dishPrice.textContent = data.price || "";
    dishTime.textContent = data.time || "";

    // tags -> chips (sheet)
    dishTags.innerHTML = "";
    const tags = String(data.tags || "").trim().split(/\s+/).filter(Boolean);

    tags.forEach((tKey) => {
      const meta = tagMeta(tKey);

      const chip = document.createElement("span");
      chip.className = "sheet-tag";

      const icon = document.createElement("i");
      icon.setAttribute("data-lucide", meta.icon || "tag");
      icon.className = "h-3.5 w-3.5 opacity-80";

      const label = document.createElement("span");
      label.textContent = meta.label || (tKey === "glutenfree" ? "Gluten-free" : capitalize(tKey));

      chip.appendChild(icon);
      chip.appendChild(label);
      dishTags.appendChild(chip);
    });

    dishOverlay.classList.remove("hidden");
    dishSheet.classList.remove("hidden");

    void dishOverlay.offsetWidth;

    dishOverlay.classList.add("is-open");
    dishSheet.classList.add("is-open");
    dishSheet.setAttribute("aria-hidden", "false");
    document.body.classList.add("sheet-open");

    if (window.lucide) window.lucide.createIcons();
  }

  function closeDishSheet() {
    dishOverlay.classList.remove("is-open");
    dishSheet.classList.remove("is-open");
    dishSheet.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sheet-open");

    setTimeout(() => {
      dishOverlay.classList.add("hidden");
      dishSheet.classList.add("hidden");
    }, 280);
  }

  dishCloseBtn.addEventListener("click", closeDishSheet);
  dishOverlay.addEventListener("click", closeDishSheet);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dishSheet.classList.contains("hidden")) closeDishSheet();
  });

  // 3) Click handler universal: Recommended + Menu grid (todo [data-item])
  document.addEventListener("click", (e) => {
    const card = e.target.closest("[data-item]");
    if (!card) return;
    if (card.classList.contains("hidden")) return;
    openDishSheetFromCard(card);
  });

  // 4) Filtros por type (tus tabs)
  const tabs = Array.from(document.querySelectorAll(".tab-btn"));
  const emptyState = document.getElementById("emptyState");
  let activeType = "all";

  function setTabActive(tabEl, isActive) {
    tabEl.setAttribute("aria-pressed", String(isActive));
    tabEl.classList.toggle("is-active", isActive);
  }

  function applyTypeFilter() {
    const items = Array.from(document.querySelectorAll("#menuGrid [data-item]"));
    items.forEach((el) => {
      const type = String(el.dataset.type || "").trim().toLowerCase();
      const matches = activeType === "all" ? true : type === activeType;
      el.classList.toggle("hidden", !matches);
    });

    const shown = items.filter((x) => !x.classList.contains("hidden")).length;
    if (emptyState) emptyState.classList.toggle("hidden", shown !== 0);
  }

  function setActiveType(type) {
    activeType = String(type || "all").toLowerCase();
    tabs.forEach((btn) => setTabActive(btn, btn.dataset.type === activeType));
    applyTypeFilter();
  }

  tabs.forEach((btn) => btn.addEventListener("click", () => setActiveType(btn.dataset.type)));
  setActiveType("all");

  // 5) Lucide refresh (por si acaso)
  if (window.lucide) window.lucide.createIcons();
})();
