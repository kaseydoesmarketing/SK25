import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';

export default defineConfig({
  plugins: [
    webExtension({
      manifest: './manifest.json',
      watchFilePaths: ['src/**/*'],
      webExtensionConfig: {
        startUrl: 'https://claude.ai',
      }
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  server: {
    port: 5173,
    hmr: {
      port: 5174
    }
  }
});