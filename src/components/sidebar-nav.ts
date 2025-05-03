// src/components/sidebar-nav.ts
import { LitElement, html, css, customElement, property, state } from "lit";
import { dbService } from "../db/database";
import { Page } from "../types/page";
import { navigate } from "../router"; // Import navigate function

interface TreeNode extends Page {
  children?: TreeNode[];
}

@customElement("sidebar-nav")
export class SidebarNav extends LitElement {
  @state() private pagesTree: TreeNode[] = [];
  @state() private isLoading = true;

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
      // Recursively build the tree (simplified for now, might need optimization for deep trees)
      this.pagesTree = await this.buildTree(topLevelPages);
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
      const node: TreeNode = { ...page };
      if (children.length > 0) {
        node.children = await this.buildTree(children);
      }
      tree.push(node);
    }
    return tree;
  }

  handleNoteClick(pageId: string) {
    navigate(`/page/${pageId}`);
  }

  async handleAddTopLevelPage() {
    const title = prompt("Enter title for new top-level page:", "New Page");
    if (title) {
      try {
        const newPageId = await dbService.createPage({ title: title, parentId: null });
        // Refresh the tree or optimistically add the new node
        this.loadPages();
        // Optionally navigate to the new page
        navigate(`/page/${newPageId}`);
      } catch (error) {
        console.error("Error creating top-level page:", error);
        alert("Failed to create page.");
      }
    }
  }

  // Recursive function to render the tree
  renderTree(nodes: TreeNode[]) {
    if (!nodes || nodes.length === 0) {
      return html`<div class="no-pages">No pages yet.</div>`;
    }
    return html`
      <ul>
        ${nodes.map(
          (node) => html`
            <li>
              <a href="/page/${node.id}" @click=${(e: Event) => { e.preventDefault(); this.handleNoteClick(node.id); }}>
                ${node.title || "Untitled"}
              </a>
              ${node.children ? this.renderTree(node.children) : ""}
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

  render() {
    return html`
      <h3>Notes</h3>
      ${this.isLoading
        ? html`<div class="loading">Loading...</div>`
        : this.renderTree(this.pagesTree)}
      <button class="add-page-button" @click=${this.handleAddTopLevelPage}>
        Add Top-Level Page
      </button>
      <!-- Toggle button functionality to be added later -->
    `;
  }
}

