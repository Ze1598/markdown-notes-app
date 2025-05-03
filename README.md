# Markdown Notes App

## Description

A modular web application for creating and managing nested Markdown notes. It features offline-first storage using IndexedDB, a clean writing interface powered by CodeMirror 6, and a live Markdown preview. The app is built with modern web technologies including Vite, TypeScript, and Lit.

This project aims to provide a performant and extensible foundation for a personal note-taking system.

## Features

### Implemented

*   **Hierarchical Notes:** Create notes and organize them in a nested structure (parent/child relationships).
*   **Markdown Editor:** Rich Markdown editing experience provided by CodeMirror 6.
*   **Live Preview:** Toggle between the editor and a live preview of the rendered Markdown (using Marked).
*   **Local-First Storage:** All notes are stored locally in your browser using IndexedDB, managed by Dexie.js.
*   **Navigation:** 
    *   Sidebar with a tree view of all notes.
    *   Breadcrumb navigation to easily track your location within the note hierarchy.
*   **CRUD Operations:** Create, Read, and Update notes. (Note: Deletion logic exists in the database service but is not yet exposed in the UI).
*   **Auto-Save:** Changes are automatically saved locally.
*   **Minimalist UI:** Clean and focused interface.
*   **Basic Responsiveness:** Layout adjusts for different screen sizes.
*   **Routing:** Client-side routing handled by Navi.

### Deferred / Not Implemented

*   User interface for deleting notes.
*   Toggleable sidebar (always visible currently).
*   Advanced keyboard shortcuts.
*   Progressive Web App (PWA) features (offline launch, installability).
*   Cloud synchronization (Planned for Phase 2).
*   Dark mode theme.

## Technologies Used

*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **UI Library:** Lit
*   **Routing:** Navi
*   **Database:** Dexie.js (IndexedDB Wrapper)
*   **Markdown Editor:** CodeMirror 6
*   **Markdown Parser:** Marked
*   **Linting/Formatting:** ESLint, Prettier

## Setup and Installation

1.  **Clone the repository (or download and extract the source code):**
    ```bash
    # If you have git installed
    # git clone <repository-url>
    # cd markdown-notes-app
    
    # If you downloaded the zip
    # unzip markdown-notes-app_final.zip
    # cd markdown-notes-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  **Open the application:**
    Navigate to the URL provided by Vite (usually `http://localhost:5173` or similar) in your web browser.

## Usage

*   **Creating Notes:** Use the "Add Top-Level Page" button in the sidebar to create root notes. While viewing a note, use the "New Sub-Page" button to create a child note under the current one.
*   **Editing:** Click on a note title in the sidebar to load it. The content will appear in the CodeMirror editor. Changes are saved automatically.
*   **Previewing:** Click the "Preview" button to see the rendered HTML version of your Markdown. Click "Edit" to return to the editor.
*   **Navigating:** Use the sidebar links or the breadcrumbs at the top of the page viewer to move between notes.

## Known Issues

*   The UI for deleting notes is not yet implemented.

## Future Enhancements

*   Implement note deletion UI.
*   Add sidebar toggling.
*   Implement PWA features for better offline support and installability.
*   Integrate cloud sync functionality.
*   Add a dark mode theme.
*   Implement advanced keyboard shortcuts.