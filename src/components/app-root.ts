// src/components/app-root.ts
import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js"; // Use state for route
import { Route, Router } from "navi";
import { navigation } from "../router"; // Import the navigation instance
import "./sidebar-nav"; // Import sidebar component
import "./page-viewer"; // Import page viewer component
import "./home-placeholder"; // Import placeholder
import "./not-found"; // Import not found component

console.log("[app-root.ts] File loaded");

@customElement("app-root")
export class AppRoot extends LitElement {
  @state() private route?: Route;
  private router: Router;

  constructor() {
    super();
    console.log("[app-root] Constructor called - Initializing");
    this.router = navigation; // Use the exported navigation instance
  }

  connectedCallback() {
    super.connectedCallback();
    console.log("[app-root] ConnectedCallback called - Component added to DOM");
    this.router.subscribe(
      (route) => {
        this.route = route;
        console.log("[app-root] Route changed:", route.url.pathname, "Data:", route.data);
      },
      (error) => {
        console.error("[app-root] Router error:", error);
        // Optionally render an error state or redirect
        this.route = undefined; 
      }
    );
    // Trigger initial route resolution
    this.router.getCurrentValue(); 
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log("[app-root] DisconnectedCallback called - Component removed from DOM");
    // Unsubscribe logic might be needed if Navi doesn't handle it automatically
  }

  static styles = css`
    :host {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .sidebar {
      width: 250px; 
      border-right: 1px solid #ccc;
      overflow-y: auto;
      background-color: #f8f8f8;
      flex-shrink: 0; /* Prevent sidebar from shrinking */
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      position: relative; 
    }
  `;

  renderMainContent() {
    if (!this.route) {
      return html`<div>Loading route...</div>`;
    }

    const pageData = this.route.data?.page;
    const pathname = this.route.url.pathname;

    // Use pathname to determine which component to render statically
    if (pathname === "/") {
      return html`<home-placeholder></home-placeholder>`;
    } else if (pathname.startsWith("/page/")) {
      // Check if pageData exists, otherwise it might be a 404 handled by the router already
      if (pageData) {
        return html`<page-viewer .pageData=${pageData}></page-viewer>`;
      } else {
        // If the route matched /page/:id but no data, assume not found
        return html`<not-found></not-found>`;
      }
    } else {
      // Default to not-found for any other path (or paths handled by '*' route)
      return html`<not-found></not-found>`;
    }
  }

  render() {
    console.log("[app-root] Render method called, current route:", this.route?.url.pathname);

    return html`
      <div class="sidebar">
        <sidebar-nav></sidebar-nav> 
      </div>
      <div class="main-content">
        ${this.renderMainContent()}
      </div>
    `;
  }
}

console.log("[app-root.ts] app-root definition complete");

