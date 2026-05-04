import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [react()],
	resolve: {
		dedupe: ["react", "react-dom"],
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: command !== "serve",
			},
		},
	},
}));
