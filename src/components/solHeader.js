import { html } from "lit-html";

/**
 * Render Header component
 * @returns {TemplateResult}
 */

export const siteHeader = () => html`
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
