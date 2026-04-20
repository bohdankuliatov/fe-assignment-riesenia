/**
 * Email Validation API
 */

import { CONFIG } from "../config.js";

/**
 * Validate email endpoint
 * Returns success if email contains @riesenia.com
 *
 * @param {string} email - Email address to validate
 * @returns {Promise<{success: boolean, message: string, email: string}>}
 */
export const validateEmail = async (email) => {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/validate-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("💥 Error:", error);
        return {
            success: false,
            message: "Network error",
            email,
        };
    }
};
