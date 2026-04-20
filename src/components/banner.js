import { html } from "lit-html";

/**
 * Logic: Smooth scroll to products section
 */

export const handleBannerClick = () => {
    const productsSection = document.getElementById("solution-products");
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
};

/**
 * Banner
 */

export const solutionBanner = (banner) => html`
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
