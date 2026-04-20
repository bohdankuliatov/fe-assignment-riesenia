import { html } from "lit-html";

/**
 * Component: Category Card UI
 * @param {Object} category - Category data
 * @param {boolean} isWide - Whether to display in wide mode (with columns)
 */

export const categoryCard = (category, isWide = false) => html`
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

export const categoriesSection = (categories) => html`
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
