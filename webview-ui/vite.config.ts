import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'dist', // All files will be output inside the 'public' directory
    assetsDir: 'assets', // Static assets will be placed in 'public/assets'
    rollupOptions: {
      output: {
        // JavaScript/TypeScript files will be placed in 'public/build'
        entryFileNames: 'build/[name].js',
        chunkFileNames: 'build/[name].js',
        assetFileNames: 'assets/[name][extname]', // Assets in 'public/assets' without hashes
      },
    },
    emptyOutDir: true, // Clean the output directory before building
  },
})
