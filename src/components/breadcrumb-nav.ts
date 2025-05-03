// src/components/breadcrumb-nav.ts
import { LitElement, html, css, customElement, property } from "lit";
import { dbService } from "../db/database";
import { Page } from "../types/page";
import { navigate } from "../router";

@customElement("breadcrumb-nav")
export class BreadcrumbNav extends LitElement {
  @property({ type: String }) currentPageId?: string;
  @property({ type: Array }) ancestors: Page[] = [];

  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("currentPageId") && this.currentPageId) {
      this.fetchAncestors(this.currentPageId);
    }
  }

  async fetchAncestors(pageId: string) {
    try {
      this.ancestors = await dbService.getAncestors(pageId);
    } catch (error) {
      console.error("Error fetching ancestors:", error);
      this.ancestors = [];
    }
  }

  handleNavClick(pageId: string) {
    navigate(`/page/${pageId}`);
  }

  static styles = css`
    nav {
      padding: 0.5rem 0;
      font-size: 0.9em;
      color: #555;
    }
    a, span {
      margin-right: 0.5rem;
    }
    a {
      color: var(--link-color, #007bff);
      text-decoration: none;
      cursor: pointer;
    }
    a:hover {
      text-decoration: underline;
    }
    span:last-child a {
        color: inherit; /* Current page link less prominent */
        pointer-events: none;
        font-weight: bold;
    }
  `;

  render() {
    if (!this.currentPageId) {
      return html``; // Don't render if no page is active
    }

    return html`
      <nav aria-label="breadcrumb">
        <a href="/" @click=${(e: Event) => { e.preventDefault(); navigate('/'); }}>Home</a>
        >
        ${this.ancestors.map(
          (ancestor) => html`
            <span>
              <a href="/page/${ancestor.id}" @click=${(e: Event) => { e.preventDefault(); this.handleNavClick(ancestor.id); }}>
                ${ancestor.title || "Untitled"}
              </a> >
            </span>
          `
        )}
        <!-- Current page title could be added here if needed -->
      </nav>
    `;
  }
}

