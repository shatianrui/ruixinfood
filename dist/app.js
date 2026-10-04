(() => {
  "use strict";
  const products = window.PRODUCTS;
  let language = "zh";
  try {
    if (localStorage.getItem("ruixin-language") === "en") language = "en";
  } catch (_) {
    // Language switching also works when browser storage is unavailable.
  }
  let category = "all";
  let selectedProduct = null;
  let submitting = false;
  const $ = (id) => document.getElementById(id);
  const dialog = $("product-dialog");
  const categories = {
    preservation: ["防腐保鲜", "Preservation"],
    quality: ["品质改良", "Quality improvement"],
    protein: ["植物蛋白", "Plant protein"],
    flavor: ["天然风味", "Natural flavor"],
  };
  const t = (pair) => pair[language === "zh" ? 0 : 1];
  const esc = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  function renderProducts() {
    const shown = products.filter(
      (p) => category === "all" || p.category === category,
    );
    $("product-grid").innerHTML = shown
      .map(
        (p) =>
          `<article class="product-card"><button class="product-image" type="button" data-product="${p.id}" aria-label="${esc(t(["查看" + p.name[0] + "规格", "View " + p.name[1] + " specifications"]))}"><span class="product-number" aria-hidden="true">${String(products.indexOf(p) + 1).padStart(2, "0")}</span><img src="${p.image}" alt="${esc(t(p.name))}" width="1448" height="1086" loading="lazy" decoding="async"><span class="product-image-action" aria-hidden="true">${t(["查看产品", "View product"])}</span></button><div class="product-content"><span class="product-category">${esc(t(categories[p.category]))}</span><h3>${esc(t(p.name))}</h3>${language === "zh" ? `<p class="product-en">${esc(p.name[1])}</p>` : ""}<p class="product-description">${esc(t(p.description))}</p><div class="product-bottom"><span class="product-assay">${esc(t(p.assay))}</span><button class="spec-button" data-product="${p.id}" type="button">${t(["查看规格", "View specs"])}</button></div></div></article>`,
      )
      .join("");
    $("product-status").textContent = t([
      `当前显示 ${shown.length} 款产品`,
      `${shown.length} products shown`,
    ]);
  }
  function renderOptions() {
    const current = $("product").value;
    $("product").innerHTML =
      `<option value="">${t(["请选择产品", "Select a product"])}</option>` +
      products
        .map(
          (p) => `<option value="${esc(p.name[0])}">${esc(t(p.name))}</option>`,
        )
        .join("") +
      `<option value="Other">${t(["其他配料需求", "Other ingredients"])}</option>`;
    $("product").value = current;
  }
  function fillDialog() {
    if (!selectedProduct) return;
    $("dialog-title").textContent = t(selectedProduct.name);
    $("dialog-description").textContent = t(selectedProduct.description);
    $("dialog-image").src = selectedProduct.image;
    $("dialog-image").alt = t(selectedProduct.name);
    $("dialog-category").textContent = t(categories[selectedProduct.category]);
    $("spec-body").innerHTML = selectedProduct.specs
      .map(
        (row) =>
          `<tr><td>${esc(t(row[0]))}</td><td>${esc(t(row[1]))}</td></tr>`,
      )
      .join("");
  }
  function setLanguage(next) {
    language = next;
    try {
      localStorage.setItem("ruixin-language", language);
    } catch (_) {
      // A blocked preference store must not interrupt the page.
    }
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = t([
      "睿鑫食品｜食品配料与供应服务",
      "Ruixin Food | Food Ingredients & Supply",
    ]);
    $("language").textContent = t(["EN", "中文"]);
    $("language").setAttribute(
      "aria-label",
      t(["Switch to English", "切换为中文"]),
    );
    $("message").placeholder = t([
      "例如：产品名称、采购数量、应用方向或所需资料",
      "Product, quantity, application or documents needed",
    ]);
    const heroImage = document.querySelector(".hero-figure img");
    if (heroImage)
      heroImage.alt = t([
        "自然光下的面包与烘焙食品应用场景",
        "Bread and baked goods in natural daylight",
      ]);
    document.querySelectorAll(".application-card img").forEach((img, i) => {
      img.alt = t([
        [
          "面包与酥皮烘焙食品",
          "搭配草莓与蓝莓的酸奶",
          "带有柑橘与薄荷的清爽饮品",
        ][i],
        [
          "Bread and pastries",
          "Yogurt with strawberries and blueberries",
          "Citrus beverages with mint",
        ][i],
      ]);
    });
    renderProducts();
    renderOptions();
    fillDialog();
    scheduleNavigationUpdate();
    if (submitting)
      showStatus(
        t(["正在提交询价，请稍候…", "Sending your inquiry…"]),
        "pending",
      );
  }
  $("language").addEventListener("click", () =>
    setLanguage(language === "zh" ? "en" : "zh"),
  );
  document.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      category = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      renderProducts();
    }),
  );
  $("product-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-product]");
    if (!button) return;
    selectedProduct = products.find((p) => p.id === button.dataset.product);
    fillDialog();
    dialog.showModal();
  });
  $("close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        dialog.close();
    }
  });
  $("dialog-inquire").addEventListener("click", () => {
    $("product").value = selectedProduct.name[0];
    if (!$("message").value.trim())
      $("message").value = t([
        `您好，我想了解${selectedProduct.name[0]}的产品规格、样品及报价。`,
        `Hello, I would like specifications, samples and a quotation for ${selectedProduct.name[1]}.`,
      ]);
    dialog.close();
    document
      .getElementById("contact")
      .scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    $("name").focus({ preventScroll: true });
  });
  const menu = $("menu-toggle");
  function closeMenu() {
    menu.setAttribute("aria-expanded", "false");
    $("navigation").classList.remove("open");
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    $("navigation").classList.toggle("open", open);
  });
  $("navigation").addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });
  const navSections = Array.from(
    $("navigation").querySelectorAll('a[href^="#"]'),
  )
    .map((link) => ({
      link,
      section: document.getElementById(link.hash.slice(1)),
    }))
    .filter((item) => item.section);
  let navFrame = 0;
  function updateActiveNavigation() {
    navFrame = 0;
    let current = null;
    let nearestTop = -Infinity;
    const threshold = Math.min(window.innerHeight * 0.35, 240);
    navSections.forEach((item) => {
      const top = item.section.getBoundingClientRect().top;
      if (top <= threshold && top > nearestTop) {
        current = item;
        nearestTop = top;
      }
    });
    navSections.forEach((item) => {
      const active = item === current;
      item.link.classList.toggle("active", active);
      if (active) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    });
  }
  function scheduleNavigationUpdate() {
    if (!navFrame) navFrame = requestAnimationFrame(updateActiveNavigation);
  }
  window.addEventListener("scroll", scheduleNavigationUpdate, {
    passive: true,
  });
  window.addEventListener("resize", scheduleNavigationUpdate);
  updateActiveNavigation();
  const form = $("inquiry-form");
  function showStatus(message, kind) {
    const el = $("form-status");
    el.hidden = false;
    el.className = "form-status " + kind;
    el.textContent = message;
  }
  form.addEventListener("input", (event) => {
    if (event.target.setCustomValidity) event.target.setCustomValidity("");
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    for (const id of ["name", "phone", "message"]) {
      $(id).value = $(id).value.trim();
      if (!$(id).value)
        $(id).setCustomValidity(
          t(["请填写此项", "Please complete this field"]),
        );
    }
    if (!form.reportValidity()) return;
    if (form.elements._honey.value) return;
    submitting = true;
    $("submit-button").disabled = true;
    form.setAttribute("aria-busy", "true");
    showStatus(
      t(["正在提交询价，请稍候…", "Sending your inquiry…"]),
      "pending",
    );
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/610630838@qq.com",
        {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
          signal: controller.signal,
        },
      );
      const result = await response.json();
      if (
        !response.ok ||
        !(result.success === true || result.success === "true")
      )
        throw new Error("Submission not confirmed");
      form.reset();
      showStatus(
        t([
          "询价已提交，我们会尽快与您联系。",
          "Your inquiry was sent. We will get in touch soon.",
        ]),
        "success",
      );
    } catch (error) {
      showStatus(
        t([
          "暂未能确认提交成功，您填写的内容已保留。请稍后重试，或电话联系 13862761790。",
          "We could not confirm delivery. Your entries are preserved. Please retry later or call +86 13862761790.",
        ]),
        "error",
      );
    } finally {
      clearTimeout(timer);
      submitting = false;
      $("submit-button").disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
  $("map-details").addEventListener("toggle", () => {
    if (!$("map-details").open || $("map-content").children.length) return;
    const frame = document.createElement("iframe");
    frame.title = "公司位置 / Company location";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer";
    frame.src = window.COMPANY_MAP_URL;
    $("map-content").append(frame);
  });
  $("year").textContent = new Date().getFullYear();
  setLanguage(language);
})();
