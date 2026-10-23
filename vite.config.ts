import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { businessHtml } from './build/business-html.ts'
import { clientFromEnv } from './build/clients.ts'

// Какой сайт собирать, задаёт CLIENT (папка в clients/). BASE_PATH — подпапка на хостинге, например /demo-sites/kalina-center/.
const client = clientFromEnv()

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), businessHtml(client)],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    outDir: `dist/${client.slug}`,
    emptyOutDir: true,
  },
})
