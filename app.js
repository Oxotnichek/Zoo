const CATEGORIES = [
  { id: "dogs", name: "Собаки", hint: "Корм · игрушки · амуниция" },
  { id: "cats", name: "Кошки", hint: "Паучи · когтеточки · миски" },
  { id: "rodents", name: "Грызуны", hint: "Смеси · лакомства" },
  { id: "birds", name: "Птицы", hint: "Корм · аксессуары" },
  { id: "fish", name: "Рыбы", hint: "Корм · декор · оборудование" },
  { id: "horses", name: "Лошади", hint: "Корм · уход" },
];

const BRANDS = ["Royal Canin", "Grandorf", "Pro Plan", "Almo Nature", "Taormina", "Whiskas", "Monge", "Pedigree"];

const NEWS = [
  { date: "10.11.2026", title: "Подарок к каждому заказу от 2 000 ₽", text: "До конца месяца кладём лакомство в заказ при сумме от 2 000 ₽." },
  { date: "02.11.2026", title: "Бонусная программа обновлена", text: "Теперь 5% баллами возвращается на следующую покупку." },
  { date: "20.10.2026", title: "Новые пункты выдачи в Москве", text: "Добавили 8 точек самовывоза и постаматы 5Post." },
];

const CITIES = ["Москва", "Санкт-Петербург", "Казань", "Нижний Новгород", "Екатеринбург"];

const PET_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));
const TYPE_LABEL = { food: "Корм", treat: "Лакомства", accessory: "Аксессуары" };

const VIEWS = ["home", "catalog", "product", "favorites", "quiz", "brands", "news", "returns", "about", "delivery", "contacts"];

const state = {
  view: "home",
  petFilter: "all",
  typeFilter: "all",
  search: "",
  cart: loadJSON("zoodomik-cart", []),
  favorites: loadJSON("zoodomik-favs", []),
  city: loadJSON("zoodomik-city", "Москва"),
  productId: null,
  qty: 1,
  quiz: { step: 0, pet: null, age: null, type: null },
};

const els = {
  nav: document.getElementById("nav"),
  burger: document.getElementById("burger"),
  headerSearch: document.getElementById("headerSearch"),
  headerSearchInput: document.getElementById("headerSearchInput"),
  searchBar: document.getElementById("searchBar"),
  searchInput: document.getElementById("searchInput"),
  catalogCount: document.getElementById("catalogCount"),
  catalogGrid: document.getElementById("catalogGrid"),
  catalogEmpty: document.getElementById("catalogEmpty"),
  petFilters: document.getElementById("petFilters"),
  hitsGrid: document.getElementById("hitsGrid"),
  categoryGrid: document.getElementById("categoryGrid"),
  brandRow: document.getElementById("brandRow"),
  brandGrid: document.getElementById("brandGrid"),
  newsList: document.getElementById("newsList"),
  productDetail: document.getElementById("productDetail"),
  backToCatalog: document.getElementById("backToCatalog"),
  favToggle: document.getElementById("favToggle"),
  favCount: document.getElementById("favCount"),
  favGrid: document.getElementById("favGrid"),
  favEmpty: document.getElementById("favEmpty"),
  favPageCount: document.getElementById("favPageCount"),
  cartToggle: document.getElementById("cartToggle"),
  cartClose: document.getElementById("cartClose"),
  cart: document.getElementById("cart"),
  cartBody: document.getElementById("cartBody"),
  cartFoot: document.getElementById("cartFoot"),
  cartCount: document.getElementById("cartCount"),
  cartTotal: document.getElementById("cartTotal"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  overlay: document.getElementById("overlay"),
  cityToggle: document.getElementById("cityToggle"),
  cityLabel: document.getElementById("cityLabel"),
  cityModal: document.getElementById("cityModal"),
  cityClose: document.getElementById("cityClose"),
  cityList: document.getElementById("cityList"),
  accountToggle: document.getElementById("accountToggle"),
  accountModal: document.getElementById("accountModal"),
  accountClose: document.getElementById("accountClose"),
  accountForm: document.getElementById("accountForm"),
  callbackToggle: document.getElementById("callbackToggle"),
  callbackModal: document.getElementById("callbackModal"),
  callbackClose: document.getElementById("callbackClose"),
  callbackForm: document.getElementById("callbackForm"),
  cookieBar: document.getElementById("cookieBar"),
  cookieAccept: document.getElementById("cookieAccept"),
  quizBox: document.getElementById("quizBox"),
  quizResults: document.getElementById("quizResults"),
  contactForm: document.getElementById("contactForm"),
  formNote: document.getElementById("formNote"),
  toast: document.getElementById("toast"),
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatPrice(n) {
  return new Intl.NumberFormat("ru-RU").format(n).replace(/\s/g, "\u00a0") + "\u00a0₽";
}

const IMG_FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect fill="#2a2a2a" width="600" height="600"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9a9a9a" font-family="sans-serif" font-size="28">ЗооДомик</text></svg>`
  );

function imgTag(src, alt = "", attrs = "") {
  const safe = String(alt).replace(/"/g, "&quot;");
  return `<img src="${src}" alt="${safe}" referrerpolicy="no-referrer" ${attrs} onerror="this.onerror=null;this.src='${IMG_FALLBACK}'" />`;
}

function showToast(text) {
  els.toast.textContent = text;
  els.toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    els.toast.hidden = true;
  }, 2000);
}

function cartQty() {
  return state.cart.reduce((s, i) => s + i.qty, 0);
}

function cartSum() {
  return state.cart.reduce((s, i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    if (!p) return s;
    return s + productPrice(p, i.variantId) * i.qty;
  }, 0);
}

function cartKey(id, variantId) {
  return `${id}::${variantId || "default"}`;
}

function isFav(id) {
  return state.favorites.includes(id);
}

function setView(view, { push = true } = {}) {
  state.view = view;
  document.querySelectorAll("[data-view]").forEach((node) => {
    node.hidden = node.dataset.view !== view;
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const active =
      link.dataset.nav === view ||
      (view === "product" && link.dataset.nav === "catalog");
    link.classList.toggle("is-active", active);
  });
  closeMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (push) {
    const hash =
      view === "product" && state.productId
        ? `#product/${state.productId}`
        : view === "home"
          ? "#home"
          : `#${view}`;
    history.pushState({ view, productId: state.productId }, "", hash);
  }

  if (view === "catalog") {
    els.searchInput.value = state.search;
    els.headerSearchInput.value = state.search;
    renderCatalog();
  }
  if (view === "product") renderProduct();
  if (view === "favorites") renderFavoritesPage();
  if (view === "quiz") renderQuiz();
  if (view === "brands") renderBrands();
  if (view === "news") renderNews();
}

function productCard(product) {
  const variant = getVariant(product);
  const badge = product.badge ? `<span class="product__badge">${product.badge}</span>` : "";
  const favActive = isFav(product.id) ? "is-active" : "";
  const variants = productVariants(product);
  const weightBtns = variants
    .map(
      (v) =>
        `<button type="button" class="product__weight${v.id === variant.id ? " is-active" : ""}" data-variant="${product.id}" data-variant-id="${v.id}">${v.label}</button>`
    )
    .join("");
  const brandLine = [product.brand, PET_LABEL[product.pet]].filter(Boolean).join(" · ");

  return `
    <article class="product" data-id="${product.id}">
      <div class="product__body" data-tilt data-tilt-max="9">
        <div class="product__stage">
          <header class="product__top">
            <p class="product__brand">${brandLine}</p>
            <button class="product__fav ${favActive}" type="button" data-fav="${product.id}" aria-label="В избранное">♡</button>
          </header>
          <button type="button" class="product__title" data-open="${product.id}">${product.name}</button>
          <p class="product__desc">${product.desc}</p>
          <div class="product__media">
            ${badge}
            <button type="button" data-open="${product.id}" aria-label="Открыть ${product.name}" class="product__hit"></button>
            ${imgTag(variant.image, product.name, 'loading="lazy" width="600" height="600" data-product-image')}
          </div>
        </div>
        <footer class="product__bar">
          <p class="product__price" data-product-price>${formatPrice(variant.price)}</p>
          <div class="product__weights" role="group" aria-label="Фасовка">${weightBtns}</div>
          <button class="btn btn--red btn--sm product__buy" type="button" data-add="${product.id}">В корзину</button>
        </footer>
      </div>
    </article>
  `;
}

function applyProductVariant(productId, variantId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  product.selectedVariant = variantId;
  const variant = getVariant(product);
  document.querySelectorAll(`.product[data-id="${productId}"]`).forEach((card) => {
    card.querySelectorAll("[data-variant-id]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.variantId === variantId);
    });
    const price = card.querySelector("[data-product-price]");
    const img = card.querySelector("[data-product-image]");
    if (price) price.textContent = formatPrice(variant.price);
    if (img && variant.image) img.src = variant.image;
  });
  if (state.view === "product" && state.productId === productId) renderProduct();
}

function filteredProducts() {
  const q = state.search.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    const petOk = state.petFilter === "all" || p.pet === state.petFilter;
    const typeOk = state.typeFilter === "all" || p.type === state.typeFilter;
    const searchOk =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      (PET_LABEL[p.pet] || "").toLowerCase().includes(q) ||
      (TYPE_LABEL[p.type] || "").toLowerCase().includes(q);
    return petOk && typeOk && searchOk;
  });
}

function renderCategories() {
  els.categoryGrid.innerHTML = CATEGORIES.map(
    (c) => `
    <button class="category" data-filter="${c.id}" type="button" data-tilt data-tilt-max="12">
      <span class="category__stage"></span>
      <span class="category__label"><strong>${c.name}</strong><em>${c.hint}</em></span>
    </button>`
  ).join("");
  const mount = () => window.Pets3D?.mount(els.categoryGrid);
  if (window.THREE) mount();
  else {
    let tries = 0;
    const wait = setInterval(() => {
      tries += 1;
      if (window.THREE || tries > 40) {
        clearInterval(wait);
        mount();
      }
    }, 100);
  }
}

function renderPetFilters() {
  els.petFilters.innerHTML =
    `<button class="filter is-active" data-filter="all" type="button">Все</button>` +
    CATEGORIES.map(
      (c) => `<button class="filter" data-filter="${c.id}" type="button">${c.name}</button>`
    ).join("");
}

function renderHits() {
  els.hitsGrid.innerHTML = PRODUCTS.filter((p) => p.hit)
    .slice(0, 9)
    .map(productCard)
    .join("");
}

function renderOrbit() {
  /* orbit stage removed — kept as no-op for older calls */
}

let carouselIndex = 0;
let carouselItems = [];
const CAROUSEL_RADIUS = 380;

function renderCarousel3D() {
  const wheel = document.getElementById("carouselWheel");
  if (!wheel) return;
  carouselItems = PRODUCTS.filter((p) => p.hit).slice(0, 7);
  const n = carouselItems.length;
  const radius = CAROUSEL_RADIUS;
  wheel.innerHTML = carouselItems
    .map((p, i) => {
      const angle = (360 / n) * i;
      const variant = getVariant(p);
      return `
        <article class="carousel3d__card" data-open="${p.id}" style="transform: rotateY(${angle}deg) translateZ(${radius}px)">
          <div class="carousel3d__face" data-tilt data-tilt-max="14">
            ${imgTag(variant.image, p.name)}
            <div class="meta">
              <h3>${p.name}</h3>
              <p>${formatPrice(variant.price)}</p>
            </div>
          </div>
        </article>`;
    })
    .join("");
  updateCarousel();
}

function updateCarousel() {
  const wheel = document.getElementById("carouselWheel");
  if (!wheel || !carouselItems.length) return;
  const step = 360 / carouselItems.length;
  wheel.style.transform = `translateZ(-${CAROUSEL_RADIUS}px) rotateY(${-carouselIndex * step}deg)`;
}


function renderBrandRow() {
  els.brandRow.innerHTML = BRANDS.slice(0, 4)
    .map((b) => `<button class="brand-card" type="button" data-brand="${b}" data-tilt data-tilt-max="16">${b}</button>`)
    .join("");
}

function renderBrands() {
  els.brandGrid.innerHTML = BRANDS.map(
    (b) => `<button class="brand-card" type="button" data-brand="${b}" data-tilt data-tilt-max="16">${b}</button>`
  ).join("");
}

function renderNews() {
  els.newsList.innerHTML = NEWS.map(
    (n) => `
    <article class="news-card" data-tilt data-tilt-max="8">
      <time>${n.date}</time>
      <h3>${n.title}</h3>
      <p>${n.text}</p>
    </article>`
  ).join("");
}

function renderCatalog() {
  const list = filteredProducts();
  els.catalogGrid.innerHTML = list.map(productCard).join("");
  els.catalogEmpty.hidden = list.length > 0;
  const pet = state.petFilter === "all" ? "Все товары" : PET_LABEL[state.petFilter];
  els.catalogCount.textContent = `${pet} · ${list.length}`;

  document.querySelectorAll(".filters .filter").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.filter === state.petFilter);
  });
  document.querySelectorAll(".type-filters .chip").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.type === state.typeFilter);
  });
}

function renderFavoritesPage() {
  const list = PRODUCTS.filter((p) => isFav(p.id));
  els.favGrid.innerHTML = list.map(productCard).join("");
  els.favEmpty.hidden = list.length > 0;
  els.favPageCount.textContent = list.length ? `${list.length} товар(ов)` : "Сохранённые товары";
  renderFavCount();
}

function renderFavCount() {
  const n = state.favorites.length;
  els.favCount.hidden = n === 0;
  els.favCount.textContent = String(n);
}

function renderProduct() {
  const product = PRODUCTS.find((p) => p.id === state.productId);
  if (!product) {
    setView("catalog");
    return;
  }
  state.qty = 1;
  const variant = getVariant(product);
  const attrs = [
    `Фасовка: ${variant.label}`,
    product.age && `Возраст: ${product.age}`,
    product.taste && `Вкус: ${product.taste}`,
  ]
    .filter(Boolean)
    .map((a) => `<span>${a}</span>`)
    .join("");
  const favActive = isFav(product.id) ? "is-active" : "";
  const weightBtns = productVariants(product)
    .map(
      (v) =>
        `<button type="button" class="product__weight${v.id === variant.id ? " is-active" : ""}" data-variant="${product.id}" data-variant-id="${v.id}">${v.label}</button>`
    )
    .join("");

  els.productDetail.innerHTML = `
    <div class="product-detail__media">
      ${imgTag(variant.image, product.name, 'width="900" height="900" data-product-image')}
    </div>
    <div class="product-detail__info">
      <span class="tag">${PET_LABEL[product.pet]} · ${TYPE_LABEL[product.type]}${product.brand ? ` · ${product.brand}` : ""}</span>
      <h1>${product.name}</h1>
      <p class="price" style="font-size:1.35rem;margin:12px 0 16px" data-product-price>${formatPrice(variant.price)}</p>
      <p>${product.full}</p>
      <div class="product__weights" role="group" aria-label="Фасовка" style="margin-top:14px">${weightBtns}</div>
      ${attrs ? `<div class="product__attrs" style="margin-top:14px">${attrs}</div>` : ""}
      <div class="product-detail__actions">
        <div class="qty" aria-label="Количество">
          <button type="button" data-qty="-1" aria-label="Меньше">−</button>
          <span id="qtyValue">1</span>
          <button type="button" data-qty="1" aria-label="Больше">+</button>
        </div>
        <button class="btn btn--red" type="button" data-add-detail="${product.id}">В корзину</button>
        <button class="btn btn--line ${favActive}" type="button" data-fav="${product.id}">${isFav(product.id) ? "В избранном" : "В избранное"}</button>
      </div>
    </div>
  `;
}

function toggleFav(id) {
  if (isFav(id)) state.favorites = state.favorites.filter((x) => x !== id);
  else state.favorites.push(id);
  saveJSON("zoodomik-favs", state.favorites);
  renderFavCount();
  showToast(isFav(id) ? "Добавлено в избранное" : "Удалено из избранного");
  if (state.view === "favorites") renderFavoritesPage();
  if (state.view === "catalog") renderCatalog();
  if (state.view === "home") renderHits();
  if (state.view === "product") renderProduct();
  if (state.view === "quiz" && !els.quizResults.hidden) renderQuizResults();
}

function addToCart(id, qty = 1) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  const variantId = getVariant(product).id;
  const existing = state.cart.find((i) => i.id === id && i.variantId === variantId);
  if (existing) existing.qty += qty;
  else state.cart.push({ id, variantId, qty });
  saveJSON("zoodomik-cart", state.cart);
  renderCart();
  showToast("Добавлено в корзину");
}

function changeCartQty(id, delta, variantId) {
  const item = state.cart.find((i) => i.id === id && (i.variantId || "default") === (variantId || "default"));
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((i) => !(i.id === id && (i.variantId || "default") === (variantId || "default")));
  }
  saveJSON("zoodomik-cart", state.cart);
  renderCart();
}

function renderCart() {
  const count = cartQty();
  els.cartCount.hidden = count === 0;
  els.cartCount.textContent = String(count);
  els.cartFoot.hidden = count === 0;
  els.cartTotal.textContent = formatPrice(cartSum());

  if (!state.cart.length) {
    els.cartBody.innerHTML = `<p class="cart-empty">Корзина пуста.<br /><a href="#catalog" data-nav="catalog">Перейти в каталог</a></p>`;
    return;
  }

  els.cartBody.innerHTML = state.cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return "";
      const variant = getVariant(product, item.variantId);
      const key = cartKey(item.id, item.variantId);
      return `
        <div class="cart-item">
          ${imgTag(variant.image, product.name, 'width="56" height="56"')}
          <div>
            <h3>${product.name}</h3>
            <p>${variant.label} · ${formatPrice(variant.price)}</p>
            <div class="cart-item__controls">
              <button type="button" data-cart-qty="${product.id}" data-variant-id="${variant.id}" data-delta="-1">−</button>
              <span>${item.qty}</span>
              <button type="button" data-cart-qty="${product.id}" data-variant-id="${variant.id}" data-delta="1">+</button>
            </div>
          </div>
          <button class="cart-item__remove" type="button" data-remove="${product.id}" data-variant-id="${variant.id}" aria-label="Удалить">×</button>
        </div>`;
    })
    .join("");
}

function openCart() {
  els.cart.classList.add("is-open");
  els.cart.setAttribute("aria-hidden", "false");
  els.overlay.hidden = false;
}

function closeCart() {
  els.cart.classList.remove("is-open");
  els.cart.setAttribute("aria-hidden", "true");
  if (
    els.cityModal.hidden &&
    els.accountModal.hidden &&
    els.callbackModal.hidden
  ) {
    els.overlay.hidden = true;
  }
}

function openModal(modal) {
  closeCart();
  modal.hidden = false;
  els.overlay.hidden = false;
}

function closeModals() {
  els.cityModal.hidden = true;
  els.accountModal.hidden = true;
  els.callbackModal.hidden = true;
  if (!els.cart.classList.contains("is-open")) els.overlay.hidden = true;
}

function closeMenu() {
  els.nav.classList.remove("is-open");
  els.burger.classList.remove("is-open");
  els.burger.setAttribute("aria-expanded", "false");
}

function renderCities() {
  els.cityList.innerHTML = CITIES.map(
    (c) =>
      `<button type="button" data-city="${c}" class="${c === state.city ? "is-active" : ""}">${c}</button>`
  ).join("");
  els.cityLabel.textContent = state.city;
}

function renderQuiz() {
  const { step, pet, age, type } = state.quiz;
  if (step >= 3) {
    renderQuizResults();
    return;
  }

  els.quizResults.hidden = true;
  const steps = [
    {
      title: "Кто ваш питомец?",
      key: "pet",
      options: CATEGORIES.filter((c) => ["dogs", "cats", "rodents", "birds", "fish"].includes(c.id)).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    },
    {
      title: "Возраст питомца?",
      key: "age",
      options: [
        { value: "young", label: "Щенок / котёнок / молодой" },
        { value: "adult", label: "Взрослый" },
        { value: "any", label: "Не важно" },
      ],
    },
    {
      title: "Что ищете?",
      key: "type",
      options: [
        { value: "food", label: "Корм" },
        { value: "treat", label: "Лакомства" },
        { value: "accessory", label: "Аксессуары" },
        { value: "any", label: "Всё подряд" },
      ],
    },
  ];

  const current = steps[step];
  els.quizBox.innerHTML = `
    <div class="quiz-step">
      <div class="quiz-progress">Шаг ${step + 1} из 3</div>
      <h3>${current.title}</h3>
      <div class="quiz-options">
        ${current.options
          .map(
            (o) =>
              `<button type="button" data-quiz-key="${current.key}" data-quiz-value="${o.value}">${o.label}</button>`
          )
          .join("")}
      </div>
      ${step > 0 ? `<button class="btn btn--line btn--sm" style="margin-top:16px" type="button" data-quiz-back>Назад</button>` : ""}
    </div>
  `;
  void pet;
  void age;
  void type;
}

function renderQuizResults() {
  const { pet, age, type } = state.quiz;
  let list = PRODUCTS.filter((p) => !pet || p.pet === pet);
  if (type && type !== "any") list = list.filter((p) => p.type === type);
  if (age === "young") list = list.filter((p) => !p.age || /котён|щенк|молод|Все/i.test(p.age));
  if (age === "adult") list = list.filter((p) => !p.age || /Взросл|Все/i.test(p.age));
  if (!list.length) list = PRODUCTS.filter((p) => p.pet === pet).slice(0, 3);

  els.quizBox.innerHTML = `
    <div class="quiz-step">
      <div class="quiz-progress">Готово</div>
      <h3>Подобрали ${list.length} вариант(ов)</h3>
      <button class="btn btn--line btn--sm" type="button" data-quiz-reset>Пройти ещё раз</button>
    </div>
  `;
  els.quizResults.hidden = false;
  els.quizResults.innerHTML = list.map(productCard).join("");
}

function applySearch(value) {
  state.search = value;
  state.petFilter = "all";
  state.typeFilter = "all";
  setView("catalog");
}

function parseHash() {
  const raw = location.hash.replace(/^#/, "") || "home";
  const [view, productId] = raw.split("/");
  if (view === "product" && productId) {
    state.productId = productId;
    setView("product", { push: false });
    return;
  }
  if (VIEWS.includes(view)) {
    state.productId = null;
    setView(view, { push: false });
    return;
  }
  setView("home", { push: false });
}

/* Events */
document.addEventListener("click", (e) => {
  const scrollBtn = e.target.closest("[data-scroll]");
  if (scrollBtn) {
    e.preventDefault();
    const target = document.getElementById(scrollBtn.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const nav = e.target.closest("[data-nav]");
  if (nav) {
    e.preventDefault();
    state.productId = null;
    closeCart();
    closeModals();
    setView(nav.dataset.nav);
    return;
  }

  const fav = e.target.closest("[data-fav]");
  if (fav) {
    e.preventDefault();
    e.stopPropagation();
    toggleFav(fav.dataset.fav);
    return;
  }

  const open = e.target.closest("[data-open]");
  if (open) {
    state.productId = open.dataset.open;
    setView("product");
    return;
  }

  const variantBtn = e.target.closest("[data-variant]");
  if (variantBtn) {
    e.preventDefault();
    e.stopPropagation();
    applyProductVariant(variantBtn.dataset.variant, variantBtn.dataset.variantId);
    return;
  }

  const add = e.target.closest("[data-add]");
  if (add) {
    e.preventDefault();
    addToCart(add.dataset.add);
    return;
  }

  const addDetail = e.target.closest("[data-add-detail]");
  if (addDetail) {
    addToCart(addDetail.dataset.addDetail, state.qty);
    return;
  }

  const qtyBtn = e.target.closest("[data-qty]");
  if (qtyBtn) {
    state.qty = Math.max(1, state.qty + Number(qtyBtn.dataset.qty));
    const label = document.getElementById("qtyValue");
    if (label) label.textContent = String(state.qty);
    return;
  }

  const cartQtyBtn = e.target.closest("[data-cart-qty]");
  if (cartQtyBtn) {
    changeCartQty(cartQtyBtn.dataset.cartQty, Number(cartQtyBtn.dataset.delta), cartQtyBtn.dataset.variantId);
    return;
  }

  const remove = e.target.closest("[data-remove]");
  if (remove) {
    const vid = remove.dataset.variantId || "default";
    state.cart = state.cart.filter(
      (i) => !(i.id === remove.dataset.remove && (i.variantId || "default") === vid)
    );
    saveJSON("zoodomik-cart", state.cart);
    renderCart();
    return;
  }

  const category = e.target.closest(".category[data-filter]");
  if (category) {
    state.petFilter = category.dataset.filter;
    state.typeFilter = "all";
    state.search = "";
    els.searchInput.value = "";
    els.headerSearchInput.value = "";
    setView("catalog");
    return;
  }

  const filter = e.target.closest(".filters .filter");
  if (filter) {
    state.petFilter = filter.dataset.filter;
    renderCatalog();
    return;
  }

  const chip = e.target.closest(".type-filters .chip");
  if (chip) {
    state.typeFilter = chip.dataset.type;
    renderCatalog();
    return;
  }

  const brand = e.target.closest("[data-brand]");
  if (brand) {
    state.search = brand.dataset.brand;
    state.petFilter = "all";
    state.typeFilter = "all";
    setView("catalog");
    return;
  }

  const city = e.target.closest("[data-city]");
  if (city) {
    state.city = city.dataset.city;
    saveJSON("zoodomik-city", state.city);
    renderCities();
    closeModals();
    showToast(`Город: ${state.city}`);
    return;
  }

  const quizOpt = e.target.closest("[data-quiz-key]");
  if (quizOpt) {
    state.quiz[quizOpt.dataset.quizKey] = quizOpt.dataset.quizValue;
    state.quiz.step += 1;
    renderQuiz();
    return;
  }

  if (e.target.closest("[data-quiz-back]")) {
    state.quiz.step = Math.max(0, state.quiz.step - 1);
    renderQuiz();
    return;
  }

  if (e.target.closest("[data-quiz-reset]")) {
    state.quiz = { step: 0, pet: null, age: null, type: null };
    renderQuiz();
  }
});

els.burger.addEventListener("click", () => {
  const open = !els.nav.classList.contains("is-open");
  els.nav.classList.toggle("is-open", open);
  els.burger.classList.toggle("is-open", open);
  els.burger.setAttribute("aria-expanded", String(open));
});

els.headerSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  applySearch(els.headerSearchInput.value);
});

els.searchBar.addEventListener("submit", (e) => {
  e.preventDefault();
  state.search = els.searchInput.value;
  renderCatalog();
});

els.searchInput.addEventListener("input", () => {
  state.search = els.searchInput.value;
  if (state.view === "catalog") renderCatalog();
});

els.cartToggle.addEventListener("click", openCart);
els.cartClose.addEventListener("click", closeCart);
els.overlay.addEventListener("click", () => {
  closeCart();
  closeModals();
});

els.favToggle.addEventListener("click", () => setView("favorites"));

els.cityToggle.addEventListener("click", () => openModal(els.cityModal));
els.cityClose.addEventListener("click", closeModals);
els.accountToggle.addEventListener("click", () => openModal(els.accountModal));
els.accountClose.addEventListener("click", closeModals);
els.callbackToggle.addEventListener("click", () => openModal(els.callbackModal));
els.callbackClose.addEventListener("click", closeModals);

els.accountForm.addEventListener("submit", (e) => {
  e.preventDefault();
  closeModals();
  showToast("Вы вошли в кабинет");
});

els.callbackForm.addEventListener("submit", (e) => {
  e.preventDefault();
  closeModals();
  els.callbackForm.reset();
  showToast("Перезвоним в ближайшее время");
});

els.checkoutBtn.addEventListener("click", () => {
  if (!state.cart.length) return;
  state.cart = [];
  saveJSON("zoodomik-cart", state.cart);
  renderCart();
  closeCart();
  showToast("Заказ принят · бонусы начислены");
});

els.backToCatalog.addEventListener("click", () => {
  state.productId = null;
  setView("catalog");
});

els.contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  els.formNote.hidden = false;
  els.contactForm.reset();
  showToast("Сообщение отправлено");
});

els.cookieAccept.addEventListener("click", () => {
  localStorage.setItem("zoodomik-cookies", "1");
  els.cookieBar.hidden = true;
});

window.addEventListener("popstate", parseHash);

renderCategories();
renderPetFilters();
renderHits();
renderBrandRow();
renderOrbit();
renderCarousel3D();
renderCart();
renderFavCount();
renderCities();
parseHash();

document.getElementById("stagePrev")?.addEventListener("click", () => {
  carouselIndex = (carouselIndex - 1 + carouselItems.length) % carouselItems.length;
  updateCarousel();
});

document.getElementById("stageNext")?.addEventListener("click", () => {
  carouselIndex = (carouselIndex + 1) % carouselItems.length;
  updateCarousel();
});

const carousel = document.getElementById("carousel3d");
let carouselPaused = false;
if (carousel) {
  let startX = 0;
  carousel.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
  });
  carousel.addEventListener("pointerup", (e) => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) carouselIndex = (carouselIndex + 1) % carouselItems.length;
    else carouselIndex = (carouselIndex - 1 + carouselItems.length) % carouselItems.length;
    updateCarousel();
  });
  carousel.addEventListener("pointerenter", () => {
    carouselPaused = true;
  });
  carousel.addEventListener("pointerleave", () => {
    carouselPaused = false;
  });
}

setInterval(() => {
  if (!carouselItems.length || carouselPaused || document.hidden) return;
  carouselIndex = (carouselIndex + 1) % carouselItems.length;
  updateCarousel();
}, 4200);

/* --- 3D scenes: hero parallax + pointer tilt --- */
(function initDepth3d() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const hero = document.getElementById("hero3d");
  if (hero) {
    let hx = 0;
    let hy = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;

    const paintHero = () => {
      raf = 0;
      hx += (tx - hx) * 0.12;
      hy += (ty - hy) * 0.12;
      hero.style.setProperty("--hx", hx.toFixed(4));
      hero.style.setProperty("--hy", hy.toFixed(4));
      if (Math.abs(tx - hx) > 0.001 || Math.abs(ty - hy) > 0.001) {
        raf = requestAnimationFrame(paintHero);
      }
    };

    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(paintHero);
    });

    hero.addEventListener("pointerleave", () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(paintHero);
    });
  }

  const tiltMax = (el) => Number(el.getAttribute("data-tilt-max") || 12);

  document.addEventListener("pointermove", (e) => {
    if (e.target.closest(".product__fav, .btn, [data-add], .product__weight")) return;
    const card = e.target.closest("[data-tilt]");
    if (!card || card.closest(".drawer, .modal")) return;
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    const max = tiltMax(card);
    const rx = (0.5 - y) * max;
    const ry = (x - 0.5) * max;
    card.style.setProperty("--tilt-x", `${rx.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${ry.toFixed(2)}deg`);
    card.style.setProperty("--tilt-z", "16px");
    card.classList.add("is-tilting");
  });

  document.addEventListener("pointerleave", (e) => {
    const card = e.target.closest?.("[data-tilt]");
    if (!card) return;
    card.classList.remove("is-tilting");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--tilt-z", "0px");
  }, true);

  document.addEventListener(
    "pointerout",
    (e) => {
      const card = e.target.closest?.("[data-tilt]");
      if (!card) return;
      if (e.relatedTarget && card.contains(e.relatedTarget)) return;
      card.classList.remove("is-tilting");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--tilt-z", "0px");
    },
    true
  );

  // Scroll parallax for shelf sections
  const shelves = document.querySelectorAll(".category-grid, .benefit-3d, .brand-row");
  const onScroll = () => {
    const mid = window.innerHeight * 0.55;
    shelves.forEach((shelf) => {
      const r = shelf.getBoundingClientRect();
      const t = (mid - (r.top + r.height / 2)) / window.innerHeight;
      shelf.style.setProperty("--scroll-tilt", `${(t * 6).toFixed(2)}deg`);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

if (!localStorage.getItem("zoodomik-cookies")) {
  els.cookieBar.hidden = false;
}
