// src/router/index.ts
import { createBrowserNavigation, map, mount, route } from "navi";
import { dbService } from "../db/database";
import { Page } from "../types/page";

// Define application routes
const routes = mount({
  "/": route({
    title: "Home",
    getView: async () => {
      console.log("Navigated to Home");
      // Dynamically import the module and return the component constructor
      // Removed .ts extension
      const module = await import("../components/home-placeholder");
      return module.HomePlaceholder; // Return the component class
    },
  }),
  "/page/:id": map(async (request) => {
    const pageId = request.params.id;
    let pageData: Page | undefined;
    try {
      pageData = await dbService.getPage(pageId);
    } catch (error) {
      console.error(`Error fetching page ${pageId}:`, error);
    }

    if (!pageData) {
      return route({ 
          title: "Not Found", 
          getView: async () => {
              // Removed .ts extension
              const module = await import("../components/not-found");
              return module.NotFound; // Return the component class
          }
      });
    }

    return route({
      title: pageData.title || "Untitled Page",
      getView: async () => {
          // Removed .ts extension
          const module = await import("../components/page-viewer");
          return module.PageViewer; // Return the component class
      },
      // Pass data to the component via context or props mechanism of the UI library
      data: { page: pageData },
    });
  }),
  // Catch-all for not found routes
  "*": route({ 
      title: "Not Found", 
      getView: async () => {
          // Removed .ts extension
          const module = await import("../components/not-found");
          return module.NotFound; // Return the component class
      }
  }),
});

// Create navigation instance
export const navigation = createBrowserNavigation({ routes });

// Function to navigate programmatically
export const navigate = (path: string) => {
  navigation.navigate(path);
};

// Start listening to navigation changes
// This usually happens in the main application entry point (main.ts or app-root component)

