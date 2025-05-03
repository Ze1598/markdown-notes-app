// src/components/app-root.ts
import { LitElement, html, css, customElement, property } from "lit";
// import { Route, Router } from "navi";
// import { navigation } from "../router"; // Import the navigation instance
// import "./sidebar-nav"; // Import sidebar component (will be created later)
// import "./page-viewer";

console.log("[app-root.ts] File loaded");

@customElement("app-root")
export class AppRoot extends LitElement {
  // @property({ type: Object }) route?: Route;
  // private router: Router;

  constructor() {
    super();
    console.log("[app-root] Constructor called - Initializing");
    // this.router = navigation; // Use the exported navigation instance
  }

  connectedCallback() {
    super.connectedCallback();
    console.log("[app-root] ConnectedCallback called - Component added to DOM");
    // this.router.subscribe(
    //   (route) => {
    //     this.route = route;
    //     console.log("[app-root] Route changed:", route.url.pathname);
    //   },
    //   (error) => {
    //     console.error("[app-root] Router error:", error);
    //     this.route = undefined; 
    //   }
    // );
    // this.router.getCurrentValue();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log("[app-root] DisconnectedCallback called - Component removed from DOM");
  }

  static styles = css`
    :host {
      display: block; /* Changed to block for simple rendering test */
      padding: 2rem;
      border: 2px solid red;
      background-color: lightyellow; /* Make it very visible */
      min-height: 100px; /* Ensure it has some size */
    }
    h1 {
        color: blue;
    }
    /* Commented out complex layout for testing */
    /* .sidebar {
      width: 250px; 
      border-right: 1px solid #ccc;
      overflow-y: auto;
      background-color: #f8f8f8;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      position: relative; 
    } */
  `;

  render() {
    console.log("[app-root] Render method called - Rendering static content");
    // Simple static render test
    return html`
      <h1>Hello from App Root!</h1>
      <p>If you see this, the basic Lit component is working.</p>
    `;

    /* Original router-based render
    const ViewComponent = this.route?.getView();
    const routeData = this.route?.data;

    return html`
      <div class="sidebar">
        <sidebar-nav></sidebar-nav> 
      </div>
      <div class="main-content">
        ${ViewComponent
          ? html`<${ViewComponent} .routeData=${routeData}></${ViewComponent}>`
          : html`<div>Loading...</div>`}
      </div>
    `;
    */
  }
}

console.log("[app-root.ts] app-root definition complete");

// Keep dummy components defined if needed elsewhere, but they aren't used in this simplified test
@customElement("home-placeholder")
class HomePlaceholder extends LitElement {
  render() { return html`<h2>Home</h2><p>Select or create a note.</p>`; }
}

@customElement("not-found")
class NotFound extends LitElement {
  render() { return html`<h2>Page Not Found</h2>`; }
}

