// src/components/home-placeholder.ts
import { LitElement, html, customElement } from "lit";

@customElement("home-placeholder")
export class HomePlaceholder extends LitElement {
  render() {
    return html`<h2>Home</h2><p>Select or create a note from the sidebar.</p>`;
  }
}

