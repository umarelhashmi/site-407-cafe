/**
 * 407 Cafe — Interactive Triptych Stage, 2s Mobile Crossfade Loop & Complete Menu Ledger
 */
(function () {
  "use strict";

  const ORDER_ONLINE_URL =
    "https://www.google.com/searchviewer/42?cvd=CLw_EiUKI-ICIDIeEhciFdLX29IPDwoLL2cvMXRtMHRfMGQYADoDCPAN";

  const data = window.CAFE407_DATA || { categories: [], reviews: {} };
  const categories = data.categories || [];

  // -------------------------------------------------------------------------
  // 1. Mobile 2-Second Crossfade Loop for the 3-Split Hero Stage
  // -------------------------------------------------------------------------
  const panels = Array.from(document.querySelectorAll(".triptych-panel"));
  const dots = Array.from(document.querySelectorAll(".mobile-slide-dot"));
  let currentSlide = 0;
  let slideTimer = null;

  function setMobileSlide(index) {
    if (!panels.length) return;
    currentSlide = (index + panels.length) % panels.length;
    panels.forEach((p, idx) => {
      p.classList.toggle("is-mobile-active", idx === currentSlide);
    });
    dots.forEach((d, idx) => {
      d.classList.toggle("is-active", idx === currentSlide);
      d.setAttribute("aria-selected", idx === currentSlide ? "true" : "false");
    });
  }

  function startMobileCrossfadeLoop() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      setMobileSlide(currentSlide + 1);
    }, 2000);
  }

  setMobileSlide(0);
  startMobileCrossfadeLoop();

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      setMobileSlide(idx);
      startMobileCrossfadeLoop();
    });
  });

  // Hero panel click -> scroll to category in menu ledger
  panels.forEach((panel) => {
    panel.addEventListener("click", () => {
      const targetCat = panel.getAttribute("data-target-category");
      if (targetCat) {
        selectCategory("all");
        setTimeout(() => {
          const el = document.getElementById("cat-" + targetCat);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 40);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 2. Render "Most Ordered" Oval Medallion Tasting Ribbon
  // -------------------------------------------------------------------------
  const ribbonTrack = document.getElementById("most-ordered-ribbon");
  const mostOrderedCat =
    categories.find((c) => c.id === "popular-items" || c.name === "Most Ordered") ||
    categories[0];

  if (ribbonTrack && mostOrderedCat && Array.isArray(mostOrderedCat.items)) {
    ribbonTrack.innerHTML = mostOrderedCat.items
      .map((item) => {
        const thumbSrc = item.thumb || item.image || "assets/images/logo/logo-407-cafe.webp";
        const calloutHtml = item.callout
          ? `<span class="medallion-callout">${escapeHtml(item.callout)}</span>`
          : item.rating
          ? `<span class="medallion-callout">★ ${escapeHtml(item.rating)}</span>`
          : "";
        return `
          <button type="button" class="medallion-pill" data-item-id="${escapeAttr(item.id)}" data-cat-id="${escapeAttr(mostOrderedCat.id)}">
            <img class="medallion-thumb" src="${escapeAttr(thumbSrc)}" alt="${escapeAttr(item.name)}" width="54" height="54" loading="lazy" decoding="async">
            <span class="medallion-text">
              ${calloutHtml}
              <span class="medallion-name">${escapeHtml(item.name)}</span>
              <span class="medallion-price">${escapeHtml(item.price)}</span>
            </span>
          </button>
        `;
      })
      .join("");

    ribbonTrack.addEventListener("click", (e) => {
      const pill = e.target.closest(".medallion-pill");
      if (!pill) return;
      const itemId = pill.getAttribute("data-item-id");
      const found = mostOrderedCat.items.find((i) => String(i.id) === String(itemId));
      if (found) {
        openDishModal(found, mostOrderedCat.name);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Render Category Navigation (Desktop Left Rail + Mobile Sticky Strip)
  //    and Complete Menu Ledger
  // -------------------------------------------------------------------------
  const desktopCatList = document.getElementById("category-index-list");
  const mobileCatScroll = document.getElementById("mobile-cat-scroll");
  const ledgerStage = document.getElementById("menu-ledger-stage");
  const desktopSearch = document.getElementById("menu-search-input");
  const mobileSearch = document.getElementById("mobile-search-input");
  const clearSearchBtn = document.getElementById("menu-search-clear");

  let activeCategoryId = "all";
  let searchQuery = "";

  const totalItemsCount = categories.reduce((sum, c) => sum + (c.items ? c.items.length : 0), 0);

  function renderCategoryNavs() {
    const allBtnDesktop = `
      <button type="button" class="cat-nav-btn ${activeCategoryId === "all" ? "is-active" : ""}" data-cat="all">
        <span>All Menu Categories</span>
        <span class="cat-count-pill">${totalItemsCount}</span>
      </button>
    `;
    const catBtnsDesktop = categories
      .map(
        (cat) => `
      <button type="button" class="cat-nav-btn ${activeCategoryId === cat.id ? "is-active" : ""}" data-cat="${escapeAttr(cat.id)}">
        <span>${escapeHtml(cat.name)}</span>
        <span class="cat-count-pill">${cat.items.length}</span>
      </button>
    `
      )
      .join("");

    if (desktopCatList) {
      desktopCatList.innerHTML = allBtnDesktop + catBtnsDesktop;
    }

    const allBtnMobile = `
      <button type="button" class="mobile-cat-chip ${activeCategoryId === "all" ? "is-active" : ""}" data-cat="all">
        All (${totalItemsCount})
      </button>
    `;
    const catBtnsMobile = categories
      .map(
        (cat) => `
      <button type="button" class="mobile-cat-chip ${activeCategoryId === cat.id ? "is-active" : ""}" data-cat="${escapeAttr(cat.id)}">
        ${escapeHtml(cat.name)} (${cat.items.length})
      </button>
    `
      )
      .join("");

    if (mobileCatScroll) {
      mobileCatScroll.innerHTML = allBtnMobile + catBtnsMobile;
    }
  }

  function renderLedger() {
    if (!ledgerStage) return;
    const q = searchQuery.trim().toLowerCase();

    const filteredCats = categories
      .filter((cat) => activeCategoryId === "all" || cat.id === activeCategoryId)
      .map((cat) => {
        const matchingItems = (cat.items || []).filter((it) => {
          if (!q) return true;
          const hay = `${it.name} ${it.description || ""} ${cat.name}`.toLowerCase();
          return hay.includes(q);
        });
        return {
          ...cat,
          matchingItems,
        };
      })
      .filter((cat) => cat.matchingItems.length > 0);

    if (filteredCats.length === 0) {
      ledgerStage.innerHTML = `
        <div class="category-section">
          <div class="category-header">
            <h2 class="category-title">No matching menu items</h2>
          </div>
          <p style="font-size:0.9rem;color:var(--muted-cocoa);">
            No dishes matched "${escapeHtml(searchQuery)}". Try searching for <strong>Nutella</strong>, <strong>Crepe</strong>, <strong>Panini</strong>, <strong>Waffle</strong>, or <strong>Latte</strong>.
          </p>
        </div>
      `;
      return;
    }

    ledgerStage.innerHTML = filteredCats
      .map((cat) => {
        const itemsHtml = cat.matchingItems
          .map((item) => {
            const hasPhoto = Boolean(item.image);
            const thumbSrc = item.thumb || item.image;
            const thumbHtml = hasPhoto
              ? `
              <div class="ledger-thumb-wrap">
                <img src="${escapeAttr(thumbSrc)}" alt="${escapeAttr(item.name)}" width="82" height="82" loading="lazy" decoding="async">
              </div>
            `
              : "";

            const descHtml = item.description
              ? `<p class="ledger-desc">${escapeHtml(item.description)}</p>`
              : "";

            const badges = [];
            if (item.callout) {
              badges.push(`<span class="badge-bestseller">${escapeHtml(item.callout)}</span>`);
            }
            if (item.rating) {
              badges.push(`<span class="badge-rating">★ ${escapeHtml(item.rating)}</span>`);
            }
            const badgesHtml = badges.length
              ? `<div class="ledger-badges">${badges.join("")}</div>`
              : "";

            return `
              <article class="ledger-item ${hasPhoto ? "has-photo" : "no-photo"}" data-cat-id="${escapeAttr(cat.id)}" data-item-id="${escapeAttr(item.id)}">
                ${thumbHtml}
                <div class="ledger-body">
                  <div class="ledger-headline">
                    <h3 class="ledger-name">${escapeHtml(item.name)}</h3>
                    <span class="ledger-leader" aria-hidden="true"></span>
                    <span class="ledger-price">${escapeHtml(item.price)}</span>
                  </div>
                  ${descHtml}
                  ${badgesHtml}
                </div>
              </article>
            `;
          })
          .join("");

        return `
          <section class="category-section" id="cat-${escapeAttr(cat.id)}" aria-labelledby="heading-${escapeAttr(cat.id)}">
            <header class="category-header">
              <h2 class="category-title" id="heading-${escapeAttr(cat.id)}">${escapeHtml(cat.name)}</h2>
              <span class="category-item-count">${cat.matchingItems.length} ${cat.matchingItems.length === 1 ? "item" : "items"}</span>
            </header>
            <div class="ledger-items-grid">
              ${itemsHtml}
            </div>
          </section>
        `;
      })
      .join("");
  }

  function selectCategory(catId) {
    activeCategoryId = catId;
    renderCategoryNavs();
    renderLedger();
  }

  if (desktopCatList) {
    desktopCatList.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat-nav-btn");
      if (!btn) return;
      const catId = btn.getAttribute("data-cat");
      selectCategory(catId);
      const workspace = document.getElementById("menu-section");
      if (workspace) {
        workspace.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (mobileCatScroll) {
    mobileCatScroll.addEventListener("click", (e) => {
      const btn = e.target.closest(".mobile-cat-chip");
      if (!btn) return;
      const catId = btn.getAttribute("data-cat");
      selectCategory(catId);
    });
  }

  function handleSearchInput(val) {
    searchQuery = val;
    if (desktopSearch && desktopSearch.value !== val) desktopSearch.value = val;
    if (mobileSearch && mobileSearch.value !== val) mobileSearch.value = val;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = val.trim() ? "block" : "none";
    }
    renderLedger();
  }

  if (desktopSearch) {
    desktopSearch.addEventListener("input", (e) => handleSearchInput(e.target.value));
  }
  if (mobileSearch) {
    mobileSearch.addEventListener("input", (e) => handleSearchInput(e.target.value));
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => handleSearchInput(""));
  }

  // Click on any menu item with a photo -> open Dish Modal
  if (ledgerStage) {
    ledgerStage.addEventListener("click", (e) => {
      const row = e.target.closest(".ledger-item");
      if (!row) return;
      const catId = row.getAttribute("data-cat-id");
      const itemId = row.getAttribute("data-item-id");
      const cat = categories.find((c) => String(c.id) === String(catId));
      if (!cat) return;
      const item = (cat.items || []).find((i) => String(i.id) === String(itemId));
      if (item && item.image) {
        openDishModal(item, cat.name);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. Dish & Gallery Photo Lightbox Modal
  // -------------------------------------------------------------------------
  const modalBackdrop = document.getElementById("dish-modal-backdrop");
  const modalCloseBtn = document.getElementById("dish-modal-close");
  const modalImg = document.getElementById("dish-modal-img");
  const modalTitle = document.getElementById("dish-modal-title");
  const modalPrice = document.getElementById("dish-modal-price");
  const modalDesc = document.getElementById("dish-modal-desc");
  const modalCat = document.getElementById("dish-modal-cat");

  function openDishModal(item, categoryName) {
    if (!modalBackdrop) return;
    modalImg.src = item.image || item.thumb || "assets/images/logo/logo-407-cafe.webp";
    modalImg.alt = item.name;
    modalTitle.textContent = item.name;
    modalPrice.textContent = item.price || "";
    modalDesc.textContent = item.description || "";
    modalCat.textContent = categoryName || "407 Cafe Menu";
    modalBackdrop.classList.add("is-open");
    modalBackdrop.setAttribute("aria-hidden", "false");
  }

  function closeDishModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("is-open");
    modalBackdrop.setAttribute("aria-hidden", "true");
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeDishModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeDishModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDishModal();
  });

  // Original storefront/customer photo strip click -> open in modal
  document.querySelectorAll(".strip-photo-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fullSrc = btn.getAttribute("data-full-src");
      const caption = btn.getAttribute("data-caption") || "407 Cafe Orlando";
      openDishModal(
        {
          name: caption,
          price: "",
          description: "9161 Narcoossee Rd Suite 108, Orlando, FL 32827 · (407) 658-6733",
          image: fullSrc,
        },
        "407 Cafe Photo"
      );
    });
  });

  // Initialize Menu Navs & Ledger
  renderCategoryNavs();
  renderLedger();

  // Helpers
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }
})();
