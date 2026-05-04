import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
		dedupe: ["react", "react-dom"],
	},

	server: {
		proxy: {
			"/api": {
				target: "https://travel-backend-6qda.onrender.com",
				changeOrigin: true,
				secure: true,
			},
		},
	},
	build: {
		outDir: "dist",
		sourcemap: false,
	},
}));
