/**
 * Global notification system
 * Creates and animates a toast notification
 * * @param {string} message - The text to display
 * @param {string} type - 'success' | 'warning' | 'error'
 */


export const showNotification = (message, type = "success") => {
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