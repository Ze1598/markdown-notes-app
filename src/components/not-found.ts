// src/components/not-found.ts
import { LitElement, html, customElement } from "lit";

@customElement("not-found")
export class NotFound extends LitElement {
  render() {
    return html`<h2>404 - Page Not Found</h2><p>The requested page could not be found.</p>`;
  }
}

