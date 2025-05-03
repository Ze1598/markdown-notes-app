// src/types/page.ts

export interface Page {
  id: string; // Typically a UUID
  title: string;
  content: string; // Markdown source
  parentId: string | null; // ID of the parent page, null for top-level pages
  createdAt: number; // Unix timestamp (milliseconds)
  updatedAt: number; // Unix timestamp (milliseconds)
}

