// src/components/page-viewer.ts
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js"; // Added property back
import { Page } from "../types/page";
import { dbService } from "../db/database";
import { navigate } from "../router";
import "./breadcrumb-nav";
import "./markdown-editor";
import "./markdown-preview";

@customElement("page-viewer")
export class PageViewer extends LitElement {
  // Accept pageData passed from app-root
  @property({ type: Object })
  pageData?: Page;

  @state() private page?: Page;
  @state() private isLoading = true;
  @state() private isEditing = true; // Default to edit mode
  @state() private isEditingTitle = false;
  @state() private unsavedContent: string | null = null; // Track content changes before saving

  connectedCallback(): void {
      super.connectedCallback();
      // Initial load based on property
      this.loadPageData();
  }

  // Use updated lifecycle method to react to pageData property changes
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("pageData")) {
        console.log("PageViewer pageData changed:", this.pageData);
        this.loadPageData();
    }
  }

  loadPageData() {
    if (this.pageData) {
      this.page = this.pageData;
      this.unsavedContent = null; // Reset unsaved content when page changes
      this.isLoading = false;
      this.isEditing = true; // Default to edit mode on new page load
    } else {
      // Handle case where page data isn't available
      this.isLoading = false;
      this.page = undefined;
      console.warn("PageViewer: No page data received via pageData property.");
    }
  }

  handleContentChange(event: CustomEvent<{ content: string }>) {
    this.unsavedContent = event.detail.content;
    // Optionally show an "unsaved" indicator
  }

  startTitleEdit() {
    this.isEditingTitle = true;
    // Focus the input after it's rendered
    requestAnimationFrame(() => {
      const input = this.shadowRoot?.getElementById('titleEditor') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  async saveTitleEdit(e: Event) {
    const input = e.target as HTMLInputElement;
    const newTitle = input.value.trim();
    if (newTitle && this.page && newTitle !== this.page.title) {
      try {
        await dbService.updatePage(this.page.id, { title: newTitle });
        this.page = { ...this.page, title: newTitle, updatedAt: Date.now() };
      } catch (error) {
        console.error("Error saving title:", error);
        alert("Failed to save title.");
      }
    }
    this.isEditingTitle = false;
  }

  handleTitleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      this.isEditingTitle = false;
    }
  }

  async handleSave() {
    if (this.page && this.unsavedContent !== null) {
      try {
        await dbService.updatePage(this.page.id, { content: this.unsavedContent });
        // Update local page state after successful save
        this.page = { ...this.page, content: this.unsavedContent, updatedAt: Date.now() };
        this.unsavedContent = null; // Clear unsaved flag
        console.log("Page saved successfully");
        // Optionally show a success message
      } catch (error) {
        console.error("Error saving page:", error);
        alert("Failed to save page.");
      }
    }
  }

  toggleEditMode() {
    if (this.isEditing && this.unsavedContent !== null) {
        // Optionally prompt user if they want to save changes before switching
        const discard = confirm("You have unsaved changes. Discard them and switch to preview?");
        if (!discard) return;
        this.unsavedContent = null; // Discard changes
    }
    this.isEditing = !this.isEditing;
  }

  async handleNewSubPage() {
    if (!this.page) return;
    const title = prompt("Enter title for new sub-page:", "New Sub-Page");
    if (title) {
      try {
        const newPageId = await dbService.createPage({ title: title, parentId: this.page.id });
        // Optionally refresh sidebar or navigate
        navigate(`/page/${newPageId}`);
      } catch (error) {
        console.error("Error creating sub-page:", error);
        alert("Failed to create sub-page.");
      }
    }
  }

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }
    .page-title {
        margin: 0;
        font-size: 1.5em;
        cursor: pointer;
    }
    .page-title span:hover {
        background: #f0f0f0;
        border-radius: 3px;
        padding: 2px 4px;
    }
    .page-title input {
        font-size: 1em;
        padding: 4px;
        border: 1px solid #ccc;
        border-radius: 3px;
        width: 100%;
        max-width: 300px;
    }
    .actions button {
      margin-left: 0.5rem;
      padding: 0.3rem 0.8rem;
      cursor: pointer;
    }
    .loading {
        color: #666;
    }
    .not-found {
        color: #cc0000;
    }
    /* Add styles for editor and preview containers */
  `;

  render() {
    if (this.isLoading) {
      return html`<div class="loading">Loading page...</div>`;
    }

    if (!this.page) {
      // This case might be handled by the router showing a NotFound component,
      // but added here for robustness.
      return html`<div class="not-found">Page data not available.</div>`;
    }

    return html`
      <breadcrumb-nav .currentPageId=${this.page.id}></breadcrumb-nav>
      <div class="page-header">
        <h2 class="page-title" @click=${this.startTitleEdit}>
          ${this.isEditingTitle 
            ? html`<input 
                type="text" 
                .value=${this.page.title} 
                @blur=${this.saveTitleEdit}
                @keydown=${this.handleTitleKeydown}
                id="titleEditor">`
            : html`<span>${this.page.title || "Untitled"}</span>`}
        </h2>
        <div class="actions">
          <button @click=${this.handleNewSubPage}>New Sub-Page</button>
          <button @click=${this.toggleEditMode}>${this.isEditing ? "Preview" : "Edit"}</button>
          ${this.isEditing ? html`<button @click=${this.handleSave} ?disabled=${this.unsavedContent === null}>Save</button>` : ""}
          <!-- Add delete button later -->
        </div>
      </div>

      ${this.isEditing
        ? html`
            <markdown-editor
              .initialContent=${this.page.content}
              @content-change=${this.handleContentChange}
            ></markdown-editor>
          `
        : html`
            <markdown-preview
              .markdownContent=${this.page.content}
            ></markdown-preview>
          `}
    `;
  }
}

