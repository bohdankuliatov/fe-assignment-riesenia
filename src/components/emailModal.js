import { html } from "lit-html";
import { validateEmail } from "../api/emailApi.js";
import { showNotification } from "./notification.js";

let isModalOpen = false;

// Modal visibility toggle
export const toggleModal = (show) => {
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

/**
 * Component: Email Modal UI
 */

export const emailModal = () => html`
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
