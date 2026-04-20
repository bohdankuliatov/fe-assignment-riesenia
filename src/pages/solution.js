import { html } from "lit-html";
import { loadData } from "../dataLoader.js";
import { siteHeader } from "../components/solHeader.js";
import { siteFooter } from "../components/solFooter.js";
import { solutionCtaSection } from "../components/cta.js";
import { emailModal } from "../components/emailModal.js";
import { categoriesSection } from "../components/categoryCard.js";
import { solutionBanner } from "../components/banner.js";

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
