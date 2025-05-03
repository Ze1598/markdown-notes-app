import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true, // Listen on all network interfaces
    port: 5173,
    allowedHosts: ["6c9d6251-f5ce-4e7a-bb91-260e32324d97-00-3adfbrczjcatn.riker.replit.dev"]
  },
});
