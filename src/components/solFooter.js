import { html } from "lit-html";

/**
 * Render Footer component
 * @returns {TemplateResult}
 */
export const siteFooter = () => html`
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
