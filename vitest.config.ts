import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()], //— те же плагины, что в основном vite.config.ts, чтобы JSX и алиасы путей (если есть) работали и в тестах
  test: {
    environment: 'jsdom', //— эмулирует браузерное окружение (document, window) в Node, без этого React не сможет рендериться в тестах
    globals: true, //— позволяет использовать describe, it, expect без импорта в каждом файле
    setupFiles: './src/test/setup.ts',
  },
});
