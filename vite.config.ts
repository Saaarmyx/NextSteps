import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		proxy: {
			// El backend serverless corre en `vercel dev` (puerto 3000).
			// El proxy mantiene el frontend y la API en el mismo origen.
			'/api': {
				target: 'http://127.0.0.1:3000',
				changeOrigin: true
			}
		}
	},
	build: {
		outDir: 'dist',
		sourcemap: false
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		css: true,
		include: ['tests/**/*.{test,spec}.{ts,tsx}']
	}
});
