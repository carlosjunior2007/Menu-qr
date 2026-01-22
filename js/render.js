// ./js/render.js
(function () {
  const cfg = window.MENU_CONFIG;

  function esc(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function tagMeta(tagKey) {
    return cfg.tags[tagKey] || { label: tagKey, icon: "tag", iconClass: "" };
  }

  function tagChipHTML(tagKey, variant = "menu") {
    const t = tagMeta(tagKey);
    // Usa tus clases existentes: chip + borde/ bg que ya dependen del theme
    // variant por si quieres diferenciar recommended/menu luego
    return `
      <span class="chip inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs">
        <i data-lucide="${esc(t.icon)}" class="h-4 w-4 ${esc(t.iconClass || "")}"></i>
        ${esc(t.label)}
      </span>
    `;
  }

  function dataAttrs(dish) {
    // Esto alimenta el bottom sheet (openDishSheet lee dataset)
    return `
      data-item
      data-id="${esc(dish.id)}"
      data-type="${esc(dish.type)}"
      data-name="${esc(dish.name)}"
      data-desc="${esc(dish.desc)}"
      data-ingredients="${esc(dish.ingredients)}"
      data-allergens="${esc(dish.allergens)}"
      data-time="${esc(dish.time)}"
      data-price="${esc(dish.price)}"
      data-img="${esc(dish.img)}"
      data-tags="${esc((dish.tags || []).join(" "))}"
    `;
  }

  function renderRecommendedCard(dish) {
    // Copia tu estilo actual de recommended
    // Nota: la "badge Popular" arriba puede ser fijo o derivado de tags.
    const topBadge = (dish.tags || []).includes("popular")
      ? `
        <div class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[12px] text-white backdrop-blur">
          <i data-lucide="star" class="h-4 w-4 text-amber-300"></i>
          <span>Popular</span>
        </div>
      `
      : "";

    // Tag chips visibles dentro
    const chips = (dish.tags || [])
      .slice(0, 3)
      .map((t) => tagChipHTML(t, "rec"))
      .join("");

    return `
      <article
        ${dataAttrs(dish)}
        class="snap-start min-w-[260px] overflow-hidden rounded-3xl border border-white/10 bg-[var(--graphite)] ash-glow"
      >
        <div class="relative h-40">
          <img
            class="h-full w-full object-cover"
            src="${esc(dish.img)}"
            alt="${esc(dish.name)}"
            loading="lazy"
          />
          ${topBadge}
          <div class="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/35 to-transparent"></div>
        </div>

        <div class="p-3">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-xl font-semibold text-[var(--ash)]">${esc(dish.price)}</p>
              <p class="mt-0.5 truncate text-[14px] font-semibold">${esc(dish.name)}</p>
            </div>

            <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] text-white/90 backdrop-blur">
              <i data-lucide="clock-3" class="h-4 w-4 text-white/80"></i>
              ${esc(dish.time)}
            </span>
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            ${chips}
          </div>
        </div>
      </article>
    `;
  }

  function renderMenuCard(dish, idx) {
    const chips = (dish.tags || [])
      .slice(0, 3)
      .map((t) => tagChipHTML(t, "menu"))
      .join("");

    // Mantiene tu regla: 60/40 desde 361px y la imagen a la derecha
    return `
      <article
        ${dataAttrs(dish)}
        class="enter-card c${Math.min(idx + 1, 10)} overflow-hidden rounded-3xl border border-white/10 bg-[var(--graphite)] ash-glow min-h-[248px]"
      >
        <div class="grid grid-cols-1 min-h-[248px] [@media(min-width:361px)]:grid-cols-[60%_40%]">
          <div class="p-4 flex flex-col order-2 [@media(min-width:361px)]:order-1">
            <div class="flex items-baseline justify-between gap-3">
              <h4 class="min-w-0 truncate text-lg font-semibold leading-tight">${esc(dish.name)}</h4>
              <p class="shrink-0 text-xl font-semibold tracking-tight text-[var(--ash)]">${esc(dish.price)}</p>
            </div>

            <p class="mt-1 inline-flex items-center gap-2 text-sm text-white/70">
              <i data-lucide="clock-3" class="h-4 w-4 text-white/60"></i>
              ${esc(dish.time)}
            </p>

            <div class="flex-1"></div>

            <div class="mt-3 flex flex-wrap gap-2">
              ${chips}
            </div>
          </div>

          <div class="relative w-full order-1 h-48 [@media(min-width:361px)]:order-2 [@media(min-width:361px)]:h-full">
            <img
              src="${esc(dish.img)}"
              alt="${esc(dish.name)}"
              class="h-full w-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-l from-black/0 via-black/0 to-black/30"></div>
          </div>
        </div>
      </article>
    `;
  }

  function renderAll() {
    const recTrack = document.getElementById("recommendedTrack");
    const menuGrid = document.getElementById("menuGrid");

    if (!cfg || !recTrack || !menuGrid) return;

    const recommended = cfg.dishes.filter((d) => d.recommended);
    recTrack.innerHTML = recommended.map(renderRecommendedCard).join("");

    menuGrid.innerHTML = cfg.dishes
      .map((d, i) => renderMenuCard(d, i))
      .join("");

    // Re-render icons after injecting DOM
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  window.MenuRender = { renderAll };
})();
