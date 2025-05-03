import "./styles.css"; // Basic styles
import "./components/app-root"; // Import the root component

// Initialize the app if needed, e.g., setting up services
console.log("[main.ts] App initialized - Loading app-root");

document.addEventListener("DOMContentLoaded", () => {
    console.log("[main.ts] DOMContentLoaded event fired.");
    if (!customElements.get("app-root")) {
        console.error("[main.ts] app-root component not defined!");
    } else {
        console.log("[main.ts] app-root component is defined.");
        const rootElement = document.querySelector("app-root");
        if (!rootElement) {
            console.error("[main.ts] app-root element not found in DOM!");
        } else {
            console.log("[main.ts] app-root element found in DOM.");
        }
    }
});

