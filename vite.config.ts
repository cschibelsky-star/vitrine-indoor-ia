import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        auditor: resolve(import.meta.dirname, 'auditor/index.html')
      }
    }
  },
  plugins: [
    // Permite empacotar arquivos finais autocontidos se desejado
    process.env.SINGLE_FILE ? viteSingleFile() : null
  ].filter(Boolean),
  server: {
    port: 8080,
    open: true
  }
});
