import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Multi-page: a per-language HTML (/en, /ru) with its own SEO/OG meta,
// plus a root index.html that redirects to /en. All mount the same app;
// language is derived from the URL path.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        en: fileURLToPath(new URL('./en/index.html', import.meta.url)),
        ru: fileURLToPath(new URL('./ru/index.html', import.meta.url)),
      },
    },
  },
});
