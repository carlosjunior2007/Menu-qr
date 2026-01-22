// js/render-menu.js
(function () {
  const cfg = window.MENU_CONFIG;
  if (!cfg) {
    console.error(
      "MENU_CONFIG no existe. ¿Cargaste config.js antes que render-menu.js?",
    );
    return;
  }

  const menuGrid = document.getElementById("menuGrid");
  const recommendedTrack = document.getElementById("recommendedTrack");

  if (!menuGrid) console.error("No existe #menuGrid");
  if (!recommendedTrack)
    console.error(
      "No existe #recommendedTrack (tu Recommended no tiene el id)",
    );

  if (!menuGrid || !recommendedTrack) return;

  const { tags: TAGS, recommendedTag } = cfg;

  // Helpers
  const esc = (s = "") =>
    String(s).replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );

  function chipHTML(tagKey, size = "sm") {
    const meta = TAGS[tagKey] || { label: tagKey, icon: "tag" };
    const label = meta.label || tagKey;
    const icon = meta.icon || "tag";

    // tamaños
    const cls =
      size === "md"
        ? "chip inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm"
        : "chip inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs";

    return `
      <span class="${cls}" data-tag="${esc(tagKey)}">
        <i data-lucide="${esc(icon)}" class="h-4 w-4 opacity-80"></i>
        ${esc(label)}
      </span>
    `;
  }

  function menuCardHTML(dish, idx) {
    const tagString = (dish.tags || []).join(" ");
    const chips = (dish.tags || [])
      .slice(0, 3)
      .map((t) => chipHTML(t, "sm"))
      .join("");

    return `
      <article
        data-item
        data-type="${esc(dish.type)}"
        data-tags="${esc(tagString)}"
        data-name="${esc(dish.name)}"
        data-desc="${esc(dish.desc)}"
        data-ingredients="${esc(dish.ingredients)}"
        data-allergens="${esc(dish.allergens)}"
        data-time="${esc(dish.time)}"
        data-price="${esc(dish.price)}"
        data-img="${esc(dish.img)}"
        class="enter-card c${(idx % 10) + 1} overflow-hidden rounded-3xl border border-white/10 bg-[var(--graphite)] ash-glow min-h-[248px]"
      >
        <div class="grid grid-cols-1 min-h-[248px] [@media(min-width:361px)]:grid-cols-[60%_40%]">
          <div class="p-4 flex flex-col order-2 [@media(min-width:361px)]:order-1">
            <div class="flex items-baseline justify-between gap-3">
              <h4 class="min-w-0 truncate text-lg font-semibold leading-tight">${esc(dish.name)}</h4>
              <p class="shrink-0 text-xl font-semibold tracking-tight text-[var(--ash)]">${esc(dish.price)}</p>
            </div>

            <p class="mt-1 inline-flex items-center gap-2 text-sm text-white/70">
              <i data-lucide="clock-3" class="h-4 w-4 text-white/60"></i>${esc(dish.time)}
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

  function recommendedCardHTML(dish) {
    // badge: si tiene "popular" o "recommended", muestra el primero que exista
    const badgeKey =
      (dish.tags || []).find((t) => t === "popular" || t === recommendedTag) ||
      null;
    const badge = badgeKey
      ? `
        <div class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[12px] text-white backdrop-blur">
          <i data-lucide="${esc(TAGS[badgeKey]?.icon || "star")}" class="h-4 w-4 opacity-90"></i>
          <span>${esc(TAGS[badgeKey]?.label || badgeKey)}</span>
        </div>`
      : "";

    const chipList = (dish.tags || [])
      .slice(0, 2)
      .map((t) => {
        const meta = TAGS[t] || { label: t, icon: "tag" };
        return `
      <span class="recommended-chip">
        <i data-lucide="${meta.icon || "tag"}" class="h-4 w-4 opacity-90"></i>
        ${meta.label || t}
      </span>
    `;
      })
      .join("");

    return `
      <article
        data-item
        data-type="${esc(dish.type)}"
        data-tags="${esc((dish.tags || []).join(" "))}"
        data-name="${esc(dish.name)}"
        data-desc="${esc(dish.desc)}"
        data-ingredients="${esc(dish.ingredients)}"
        data-allergens="${esc(dish.allergens)}"
        data-time="${esc(dish.time)}"
        data-price="${esc(dish.price)}"
        data-img="${esc(dish.img)}"
        class="snap-start min-w-[260px] overflow-hidden rounded-3xl border border-white/10 bg-[var(--graphite)] ash-glow"
      >
        <div class="relative h-40">
          <img class="h-full w-full object-cover" src="${esc(dish.img)}" alt="${esc(dish.name)}" loading="lazy" />
          ${badge}
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
            ${chipList}
          </div>
        </div>
      </article>
    `;
  }

  // Render
  menuGrid.innerHTML = cfg.dishes.map((d, i) => menuCardHTML(d, i)).join("");

  const rec = cfg.dishes.filter((d) => (d.tags || []).includes(recommendedTag));
  recommendedTrack.innerHTML = rec.map(recommendedCardHTML).join("");

  // Lucide refresh (porque inyectamos <i data-lucide>)
  if (window.lucide) window.lucide.createIcons();
})();
