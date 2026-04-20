import { html } from "lit-html";
import { loadData } from "../dataLoader.js";
import { validateEmail } from "../api/emailApi.js";

/**
 * State Management & UI Helpers
 */

let isModalOpen = false;

// Global notification system
const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `c-notification c-notification--${type}`;
    notification.innerHTML = `
        <div class="c-notification__content">
            ${type === "success" ? "✅" : "⚠️"} 
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("is-active"), 10);

    setTimeout(() => {
        notification.classList.remove("is-active");
        setTimeout(() => notification.remove(), 500);
    }, 3000);
};

// Modal visibility toggle
const toggleModal = (show) => {
    isModalOpen = show;
    const modal = document.querySelector(".c-modal");
    if (modal) {
        if (show) {
            modal.classList.add("is-visible");
        } else {
            modal.classList.remove("is-visible");
        }
    }
};

/**
 * Event Handlers
 */

const updateQty = (btn, delta) => {
    const input = btn.closest(".c-qty").querySelector(".c-qty__input");
    let newVal = parseInt(input.value) + delta;

    // Logic: min 1, max 10
    if (newVal >= 1 && newVal <= 10) {
        input.value = newVal;
    } else if (newVal > 10) {
        showNotification("Maximálne množstvo je 10 kusov", "warning");
    }
};

const handleAddToCart = (product, event) => {
    const card = event.currentTarget.closest(".c-product-card");
    const qtyInput = card.querySelector(".c-qty__input");
    const quantity = parseInt(qtyInput.value);

    if (quantity > 10) {
        showNotification("Maximálne množstvo na objednávku je 10 kusov.", "warning");
        return;
    }

    showNotification(`Do košíka bolo pridaných ${quantity} ks produktu ${product.name}`, "success");
    qtyInput.value = 1; // Reset counter after success
};

const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll(".c-form__input, .c-form__select");
    let isFormValid = true;

    // Validation Rules
    const validators = {
        email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        name: (val) => val.trim().length > 2,
        phone: (val) => /^\+?(\d{3}\s?){3,4}$/.test(val), // Basic international format
        source: (val) => val !== "",
    };

    inputs.forEach((input) => {
        const name = input.getAttribute("name");
        const isValid = validators[name](input.value);

        if (!isValid) {
            input.parentElement.classList.add("is-invalid");
            isFormValid = false;
        } else {
            input.parentElement.classList.remove("is-invalid");
            input.parentElement.classList.add("is-valid");
        }
    });

    if (!isFormValid) return;

    // If valid, proceed with API call
    try {
        const apiResult = await validateEmail(form.email.value);
        if (apiResult.success) {
            showNotification("Úspešne odoslané!", "success");
            toggleModal(false);
            form.reset();
        } else {
            form.email.parentElement.classList.add("is-invalid");
        }
    } catch (err) {
        console.error("API Error:", err);
        showNotification("Chyba servera", "warning");
    }
};

const handleBannerClick = () => {
    const productsSection = document.getElementById("solution-products");
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
};

/**
 * UI Components
 */

const siteHeader = () => html`
    <div class="l-container">
        <header class="c-header">
            <div class="c-header__inner">
                <div class="c-header__logo">
                    <div class="skeleton-box" style="width: 120px; height: 40px;"></div>
                </div>

                <div class="c-header__search"></div>

                <div class="c-header__actions">
                    <div class="skeleton-circle"></div>
                    <div class="skeleton-circle"></div>
                    <div class="skeleton-circle"></div>
                </div>
            </div>
        </header>
    </div>
`;

const productCard = (product) => {
    const stars = Array.from(
        { length: 5 },
        (_, i) => html`<span class="star ${i < product.rating ? "is-filled" : ""}">★</span>`
    );

    return html`
        <div class="c-product-card">
            <div class="c-product-card__top">
                <div class="c-product-card__badges">
                    ${product.badges?.map(
                        (b) => html`<span class="c-badge c-badge--${b.type}">${b.label}</span>`
                    )}
                </div>

                <div class="c-product-card__actions">
                    <button class="action-btn">
                        <img src="src/assets/images/compare.svg" alt="compare" />
                    </button>
                    <button class="action-btn">
                        <img src="src/assets/images/wishlist.svg" alt="wishlist" />
                    </button>
                </div>

                <img
                    src="src/assets/images/${product.id}.png"
                    alt="${product.name}"
                    class="c-product-card__img"
                />
            </div>

            <div class="c-product-card__body">
                <div class="c-product-card__rating">
                    <div class="stars-list">${stars}</div>
                    <span class="count">(${product.reviewCount})</span>
                </div>

                <h3 class="c-product-card__title">${product.name}</h3>
                <p class="c-product-card__sku">${product.sku}</p>

                <div class="c-product-card__price">
                    <span class="old">${product.originalPrice} ${product.currency}</span>
                    <div class="current-row">
                        <span class="current"
                            >${product.salePrice.toFixed(2).replace(".", ",")}
                            ${product.currency}</span
                        >
                    </div>
                    <span class="sub-price"
                        >${product.priceWithoutVAT.toFixed(2).replace(".", ",")} ${product.currency}
                        bez DPH</span
                    >
                </div>

                <p class="c-product-card__stock">${product.stock}</p>

                <div class="c-product-card__footer">
                    <div class="c-qty">
                        <button class="c-qty__btn" @click=${(e) => updateQty(e.currentTarget, -1)}>
                            -
                        </button>
                        <input class="c-qty__input" type="number" value="1" readonly />
                        <button class="c-qty__btn" @click=${(e) => updateQty(e.currentTarget, 1)}>
                            +
                        </button>
                    </div>
                    <button class="c-btn-add" @click=${(e) => handleAddToCart(product, e)}>
                        <svg width="24" height="23" viewBox="0 0 24 23" fill="none">
                            <path
                                d="M1 1H5L7.68 14.39C7.77 14.85 8.02 15.26 8.38 15.55C8.75 15.85 9.21 16 9.68 16H19.4C19.86 16 20.32 15.85 20.69 15.55C21.05 15.26 21.3 14.85 21.4 14.39L23 6H6M10 21C10 21.55 9.55 22 9 22C8.44 22 8 21.55 8 21C8 20.44 8.44 20 9 20C9.55 20 10 20.44 10 21ZM21 21C21 21.55 20.55 22 20 22C19.44 22 19 21.55 19 21C19 20.44 19.44 20 20 20C20.55 20 21 20.44 21 21Z"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        <span>Do košíka</span>
                    </button>
                </div>
            </div>
        </div>
    `;
};

const categoryCard = (category, isWide = false) => html`
    <div class="c-category-card">
        <div class="c-category-card__image"></div>
        <div class="c-category-card__overlay"></div>
        <div class="c-category-card__content">
            <h3 class="c-category-card__title">
                ${category.name}
                <span class="c-category-card__count">${category.productCount}</span>
            </h3>
            <ul class="c-category-card__list ${isWide ? "is-columns-2" : ""}">
                ${category.subcategories?.map((sub) => html`<li>${sub.name}</li>`)}
            </ul>
            <a href="${category.link}" class="c-category-card__link">
                ${category.ctaText}
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M4.16 10H15.83M15.83 10L10 4.16M15.83 10L10 15.83"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </a>
        </div>
    </div>
`;

/**
 * Sections
 */

const solutionBanner = (banner) => html`
    <div class="c-solution-banner">
        <div class="c-solution-banner__image"></div>
        <div class="c-solution-banner__overlay"></div>
        <div class="c-solution-banner__content">
            <h1 class="c-solution-banner__content__title">${banner.title}</h1>
            <div class="c-solution-banner__content__description">${banner.description}</div>
            <button class="c-solution-banner__content__button" @click=${handleBannerClick}>
                <span>${banner.ctaText}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M4.16 10H15.83M15.83 10L10 4.16M15.83 10L10 15.83"
                        stroke="currentColor"
                        stroke-width="1.67"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
        </div>
    </div>
`;

export const solutionCtaSection = (ctaBanner, products) => html`
    <div class="c-solution-content">
        <div class="c-solution-cta">
            <div class="c-solution-cta__image"></div>
            <div class="c-solution-cta__overlay"></div>
            <div class="c-solution-cta__content">
                <h2 class="c-solution-cta__content__title">${ctaBanner.title}</h2>
                <div class="c-solution-cta__content__description">${ctaBanner.description}</div>
                <button class="c-solution-cta__content__button" @click=${() => toggleModal(true)}>
                    <span>${ctaBanner.ctaText}</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M4.16 10H15.83M15.83 10L10 4.16M15.83 10L10 15.83"
                            stroke="currentColor"
                            stroke-width="1.67"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
        <div class="c-solution-content__products">${products?.slice(0, 2).map(productCard)}</div>
    </div>
`;

const categoriesSection = (categories) => html`
    <section class="s-categories">
        <h2 class="s-categories__title">Top kategórie produktov</h2>
        <div class="c-categories-grid">
            <div class="c-categories-grid__item div1">${categoryCard(categories[0])}</div>

            <div class="c-categories-grid__item div2">${categoryCard(categories[1], true)}</div>
            <div class="c-categories-grid__item div3">${categoryCard(categories[2], true)}</div>

            <div class="c-categories-grid__item div4">${categoryCard(categories[3])}</div>
            <div class="c-categories-grid__item div5">${categoryCard(categories[4])}</div>
        </div>
    </section>
`;

const siteFooter = () => html`
    <div class="f-container">
        <footer class="c-footer">
            <div class="c-footer__grid">
                <div class="c-footer__col">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                </div>
                <div class="c-footer__col">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                </div>
                <div class="c-footer__col">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                </div>
            </div>
        </footer>
    </div>
`;

const emailModal = () => html`
    <div class="c-modal ${isModalOpen ? "is-visible" : ""}">
        <div class="c-modal__overlay" @click=${() => toggleModal(false)}></div>
        <div class="c-modal__content">
            <button class="c-modal__close" @click=${() => toggleModal(false)}>&times;</button>
            <h2 class="c-modal__title">
                Tajná ponuka produktov <br />
                Dewalt len pre vás
            </h2>

            <form class="c-form" id="offerForm" @submit=${handleFormSubmit} novalidate>
                <div class="c-form__group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="name@domain.com"
                        class="c-form__input"
                    />
                    <span class="c-form__error-msg">Zadajte platný e-mail</span>
                </div>

                <div class="c-form__row">
                    <div class="c-form__group">
                        <label>Meno a priezvisko</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Peter Novák"
                            class="c-form__input"
                        />
                        <span class="c-form__error-msg">Meno je povinné</span>
                    </div>
                    <div class="c-form__group">
                        <label>Telefónne číslo</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+421..."
                            class="c-form__input"
                        />
                        <span class="c-form__error-msg">Zadajte číslo v tvare +421...</span>
                    </div>
                </div>

                <div class="c-form__group">
                    <label>Odkiaľ ste sa dozvedeli?</label>
                    <select name="source" class="c-form__select">
                        <option value="">Vyberte možnosť</option>
                        <option value="web">Priamo z vášho webu</option>
                        <option value="social">Sociálne siete</option>
                    </select>
                    <span class="c-form__error-msg">Vyberte zdroj</span>
                </div>

                <div class="c-form__footer">
                    <button type="submit" class="c-btn-submit">Získať tajnú ponuku →</button>
                    <p class="c-form__legal">Odoslaním súhlasíte so <a>spracovaním údajov</a></p>
                </div>
            </form>
        </div>
    </div>
`;

/**
 * Main Page Render
 */

export const renderSolutionPage = (data) => {
    if (!data) return html`<div class="l-solution">Loading...</div>`;

    return html`
        <div class="l-solution">
            ${siteHeader()}
            <div class="l-solution__banner">
                <div class="l-container">${data.banner ? solutionBanner(data.banner) : ""}</div>
            </div>

            <div class="l-solution__content" id="solution-products">
                <div class="l-container is-shorter">
                    ${data.ctaBanner ? solutionCtaSection(data.ctaBanner, data.products) : ""}
                </div>
            </div>

            <div class="l-solution__categories">
                <div class="l-container is-shorter">
                    ${data.categories ? categoriesSection(data.categories) : ""}
                </div>
            </div>
            ${emailModal()} ${siteFooter()}
        </div>
    `;
};

export const loadAndRenderSolutionPage = async () => {
    try {
        const data = await loadData();
        return renderSolutionPage(data);
    } catch (error) {
        return html`<div class="l-solution">Error: ${error.message}</div>`;
    }
};
