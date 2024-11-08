import { defineConfig } from 'vite';

export default defineConfig({
  // altre configurazioni...
  optimizeDeps: {
    exclude: ['nome-della-dipendenza-problematica']
  }
}); 