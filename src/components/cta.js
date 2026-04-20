import { html } from "lit-html";
import { productCard } from "./productCard.js";
import { toggleModal } from "./emailModal.js";

/**
 * Component: CTA Section with products
 * @param {Object} ctaBanner - CTA data from JSON
 * @param {Array} products - Product list
 */

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
