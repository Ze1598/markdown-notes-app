// src/components/sidebar-nav.ts
import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js"; // Removed unused 'property'
import { dbService } from "../db/database";
import { Page } from "../types/page";
import { navigate } from "../router"; // Import navigate function

interface TreeNode extends Page {
  children?: TreeNode[];
}

@customElement("sidebar-nav")
export class SidebarNav extends LitElement {
  @state()
  private pagesTree: TreeNode[] = [];

  @state()
  private isLoading = true;

  connectedCallback() {
    super.connectedCallback();
    this.loadPages();
    // Potentially subscribe to DB changes here if needed for real-time updates
  }

  async loadPages() {
    this.isLoading = true;
    try {
      // Fetch top-level pages
      const topLevelPages = await dbService.listChildren(null);
      // Recursively build the tree
      this.pagesTree = await this.buildTree(topLevelPages);
      console.log("[sidebar-nav] Pages loaded, tree:", this.pagesTree);
    } catch (error) {
      console.error("Error loading pages for sidebar:", error);
      // Handle error display
    } finally {
      this.isLoading = false;
    }
  }

  async buildTree(pages: Page[]): Promise<TreeNode[]> {
    const tree: TreeNode[] = [];
    for (const page of pages) {
      const children = await dbService.listChildren(page.id);
      const node: TreeNode = { ...page, children: [] }; // Initialize children array
      if (children.length > 0) {
        node.children = await this.buildTree(children);
      }
      tree.push(node);
    }
    return tree;
  }

  // Corrected handleNavClick method name and signature
  handleNavClick(e: Event, pageId: string) {
    e.preventDefault(); // Prevent default anchor behavior
    console.log(`[sidebar-nav] Navigating to /page/${pageId}`);
    navigate(`/page/${pageId}`);
  }

  async handleAddTopLevelPage() {
    // const title = prompt("Enter title for new top-level page:", "New Page");
    const title = "Test Page 1"; // Hardcoded for testing
    console.log(`[sidebar-nav] Adding top-level page with title: ${title}`);
    if (title) {
      try {
        const newPageId = await dbService.createPage({ title: title, parentId: null });
        console.log(`[sidebar-nav] New page created with ID: ${newPageId}`);
        // Refresh the tree or optimistically add the new node
        await this.loadPages(); // Ensure await here
        // Optionally navigate to the new page
        console.log(`[sidebar-nav] Navigating to new page: /page/${newPageId}`);
        navigate(`/page/${newPageId}`);
      } catch (error) {
        console.error("Error creating top-level page:", error);
        alert("Failed to create page."); // Alert might also block, consider removing for testing
      }
    }
  }

  // Corrected recursive function to render the tree with proper types
  renderTree(nodes: TreeNode[]): TemplateResult {
    if (!nodes || nodes.length === 0) {
      // Return an empty template or a message if needed, but ensure it's a TemplateResult
      return html``; 
    }
    return html`
      <ul>
        ${nodes.map(
          (node): TemplateResult => html`
            <li>
              <a href="#" @click=${(e: Event) => this.handleNavClick(e, node.id)}>
                ${node.title || "Untitled"}
              </a>
              ${node.children && node.children.length > 0
                ? this.renderTree(node.children)
                : ""}
            </li>
          `
        )}
      </ul>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
    ul {
      list-style: none;
      padding-left: 1rem; /* Indentation for sub-levels */
      margin: 0;
    }
    li {
      margin-bottom: 0.5rem;
    }
    a {
      text-decoration: none;
      color: var(--link-color, #007bff);
      cursor: pointer;
    }
    a:hover {
      text-decoration: underline;
    }
    .add-page-button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    .loading, .no-pages {
        padding: 1rem;
        color: #666;
    }
  `;

  render(): TemplateResult {
    console.log("[sidebar-nav] Rendering, isLoading:", this.isLoading, "Tree length:", this.pagesTree.length);
    return html`
      <h3>Notes</h3>
      ${this.isLoading
        ? html`<div class="loading">Loading...</div>`
        : this.pagesTree.length > 0 
          ? this.renderTree(this.pagesTree) 
          : html`<div class="no-pages">No pages yet.</div>`}
      <button class="add-page-button" @click=${this.handleAddTopLevelPage}>
        Add Top-Level Page
      </button>
    `;
  }
}

