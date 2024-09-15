import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/video_feed": {
        target: "http://localhost:5000",
        changeOrigin: true, // Ensures the origin of the host header is modified
        secure: false, // Only required for SSL endpoints
      },
      "/pause_stream": {
        target: "http://localhost:5000",
        changeOrigin: true, // Ensures the origin of the host header is modified
        secure: false, // Only required for SSL endpoints
      },
      "/resume_stream": {
        target: "http://localhost:5000",
        changeOrigin: true, // Ensures the origin of the host header is modified
        secure: false, // Only required for SSL endpoints
      },
      "/stop_stream": {
        target: "http://localhost:5000",
        changeOrigin: true, // Ensures the origin of the host header is modified
        secure: false, // Only required for SSL endpoints
      },
      "/overlay": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
