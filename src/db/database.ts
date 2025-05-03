// src/db/database.ts
import Dexie, { Table } from "dexie";
import { Page } from "../types/page";
import { v4 as uuidv4 } from "uuid"; // Using uuid for unique IDs

export class DatabaseService extends Dexie {
  pages!: Table<Page>;

  constructor() {
    super("MarkdownNotesAppDB");
    this.version(1).stores({
      // Schema definition: primary key 'id', index 'parentId'
      pages: "&id, parentId",
    });
  }

  async getPage(id: string): Promise<Page | undefined> {
    return this.pages.get(id);
  }

  async listChildren(parentId: string | null): Promise<Page[]> {
    // Dexie doesn't directly support querying for null index values easily.
    // We handle null parentId separately.
    if (parentId === null) {
      return this.pages.where("parentId").equals(Dexie.minKey).toArray();
      // Alternative if storing null directly works (depends on Dexie version/behavior):
      // return this.pages.where({ parentId: null }).toArray();
    } else {
      return this.pages.where("parentId").equals(parentId).sortBy("title");
    }
  }

  async createPage(data: Partial<Page> & { title: string; parentId: string | null }): Promise<string> {
    const now = Date.now();
    const newPage: Page = {
      id: uuidv4(),
      content: data.content || "", // Default to empty content
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    // Ensure parentId is stored correctly for Dexie's null handling
    if (newPage.parentId === null) {
        (newPage as any).parentId = Dexie.minKey; // Use Dexie.minKey for null indexing
    }

    await this.pages.add(newPage);
    return newPage.id;
  }

  async updatePage(id: string, changes: Partial<Page>): Promise<void> {
    const updateData = {
      ...changes,
      updatedAt: Date.now(),
    };
    // Ensure parentId is handled correctly if updated
    if (changes.parentId === null) {
        (updateData as any).parentId = Dexie.minKey;
    } else if (changes.parentId !== undefined) {
        updateData.parentId = changes.parentId;
    }

    await this.pages.update(id, updateData);
  }

  async deletePage(id: string): Promise<void> {
    // Potentially add logic here to handle children (e.g., re-parent or delete recursively)
    // For now, just delete the page itself.
    await this.pages.delete(id);
  }

  // Helper to get ancestors for breadcrumbs
  async getAncestors(id: string): Promise<Page[]> {
    const ancestors: Page[] = [];
    let currentPage = await this.getPage(id);
    while (currentPage && currentPage.parentId && currentPage.parentId !== Dexie.minKey) {
      const parent = await this.getPage(currentPage.parentId);
      if (parent) {
        ancestors.unshift(parent); // Add parent to the beginning of the array
        currentPage = parent;
      } else {
        break; // Parent not found, stop climbing
      }
    }
    return ancestors;
  }
}

// Export a singleton instance
export const dbService = new DatabaseService();

