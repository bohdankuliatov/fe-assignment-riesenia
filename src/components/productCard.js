import { html } from "lit-html";
import { showNotification } from "./notification.js";

/**
 * Event Handlers
 */

export const updateQty = (btn, delta) => {
    const input = btn.closest(".c-qty").querySelector(".c-qty__input");
    let newVal = parseInt(input.value) + delta;

    // Logic: min 1, max 10
    if (newVal >= 1 && newVal <= 10) {
        input.value = newVal;
    } else if (newVal > 10) {
        showNotification("Maximálne množstvo je 10 kusov", "warning");
    }
};

export const handleAddToCart = (product, event) => {
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

export const productCard = (product) => {
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
