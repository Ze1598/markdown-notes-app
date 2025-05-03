import { LitElement, html, css, TemplateResult } from "lit"; // Added TemplateResult
import { customElement, property, state } from "lit/decorators.js"; // Added state
import { unsafeHTML, UnsafeHTMLDirective } from "lit/directives/unsafe-html.js"; // Added UnsafeHTMLDirective
import { DirectiveResult } from "lit/directive.js"; // Added DirectiveResult
import { marked } from "marked"; // Import the marked library

// Basic styling for preview content (adjust as needed)
const previewStyles = css`
  /* ... styles ... */
`;

@customElement("markdown-preview")
export class MarkdownPreview extends LitElement {
  @property({ type: String })
  markdownContent = "";

  @state()
  private _renderedHtml: TemplateResult | DirectiveResult<typeof UnsafeHTMLDirective> = html`<p>Loading preview...</p>`;

  // Update rendered HTML when markdownContent changes
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("markdownContent")) {
      this._updateRenderedHtml();
    }
  }

  async _updateRenderedHtml() {
    if (!this.markdownContent) {
      this._renderedHtml = html`<p>Nothing to preview.</p>`;
      return;
    }
    try {
      // marked.parse returns a Promise in v5+
      const htmlContent = await marked.parse(this.markdownContent);
      this._renderedHtml = unsafeHTML(htmlContent);
    } catch (error) {
      console.error("Error parsing Markdown:", error);
      this._renderedHtml = html`<p style="color: red;">Error rendering preview.</p>`;
    }
  }

  static styles = [previewStyles, css`
    :host {
        display: block;
        padding: 1rem;
        border: 1px solid #eee; /* Optional border */
        background-color: #fff;
    }
  `];

  render() {
    return html`
      <div class="markdown-body">
        ${this._renderedHtml}
      </div>
    `;
  }
}

