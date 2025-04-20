import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		plugins: [react(), tailwindcss(), tsConfigPaths()],
		preview: {
			port: 4173,
			host: true,
		},
		define: {
			VITE_API_URL: JSON.stringify(env.VITE_API_URL),
		},
	};
});
