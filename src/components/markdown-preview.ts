// src/components/markdown-preview.ts
import { LitElement, html, css, customElement, property, unsafeHTML } from "lit-element";
import { marked } from "marked"; // Import the marked library

// Basic styling for preview content (adjust as needed)
const previewStyles = css`
  .markdown-body {
    font-family: sans-serif;
    line-height: 1.6;
  }
  .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }
  .markdown-body h1 {
    font-size: 2em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: .3em;
  }
  .markdown-body h2 {
    font-size: 1.5em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: .3em;
  }
  .markdown-body h3 {
    font-size: 1.25em;
  }
  .markdown-body p {
    margin-bottom: 16px;
  }
  .markdown-body ul, .markdown-body ol {
    padding-left: 2em;
    margin-bottom: 16px;
  }
  .markdown-body code {
    padding: .2em .4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27,31,35,.05);
    border-radius: 3px;
  }
  .markdown-body pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
  }
  .markdown-body pre code {
    display: inline;
    padding: 0;
    margin: 0;
    overflow: visible;
    line-height: inherit;
    word-wrap: normal;
    background-color: transparent;
    border: 0;
  }
  .markdown-body blockquote {
    margin: 0 0 16px 0;
    padding: 0 1em;
    color: #6a737d;
    border-left: .25em solid #dfe2e5;
  }
`;

@customElement("markdown-preview")
export class MarkdownPreview extends LitElement {
  @property({ type: String }) markdownContent = "";

  // Use unsafeHTML to render the parsed Markdown
  // Ensure that the Markdown source is trusted or sanitized if necessary
  renderMarkdown() {
    if (!this.markdownContent) {
      return html`<p>Nothing to preview.</p>`;
    }
    try {
      // Basic marked configuration, can be extended
      const htmlContent = marked.parse(this.markdownContent);
      return unsafeHTML(htmlContent);
    } catch (error) {
      console.error("Error parsing Markdown:", error);
      return html`<p style="color: red;">Error rendering preview.</p>`;
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
        ${this.renderMarkdown()}
      </div>
    `;
  }
}

